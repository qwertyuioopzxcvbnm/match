import { ResponseDoc } from "./schemas.js"
import mongoose from 'mongoose'
import Mustache from "mustache"
import { EmailClient } from "@azure/communication-email"; 
import {readFile, writeFile} from 'fs/promises'
import {config} from 'dotenv'

//Argument keeps from sending emails with sendgrid, useful for testing
const isDryRun = process.argv.includes('-r')
if (isDryRun) console.log("ENVIRONMENT - Dry run mode, no emails will be sent")

const isLimited = process.argv.includes('-l')
if (isLimited) console.log("ENVIRONMENT - Limit mode, generates emails for the first 5 people")

const inTesting = process.argv.includes("-d")
if (inTesting) console.log("ENVIRONMENT - Debug logs will appear")

console.log('WADaily Mailer™')
console.log('"it also sucks" - Will')
console.log('Copyright © 2022 George Parks')
console.log()
console.log('Setting Mail API Key from environment')
//loads env variables from .env file if present
config()

const mailer = new EmailClient(process.env.EMAIL_KEY)
console.log('Loading mustache template from ../emails/mail-template.html')
const template = (await readFile('../emails/mail-template.html')).toString('utf-8')
console.log('Connecting to database...')
await mongoose.connect(process.env.MONGO_URI)
console.log('Loading results from matcher tool')
//Retrieves and parses all results
const results = JSON.parse(await readFile('results-final.json'))

//starts timer to see how long this takes
console.time('Sender ran in ')

for (const [key, value] of (isLimited ? Object.entries(results).slice(0,6) : Object.entries(results))) {
    if (inTesting) console.log("Processing doc", key);
    const currentDoc = await getUserInfo(key);

    const dataToRender = {
        name: currentDoc.name,
        similarities: []
    }
    //handles the -n option from matches.mjs
    let sims = Array.isArray(value) ? value : value.similarities
    sims = sims.sort((a, b) => b.similarity - a.similarity)
    var number = 1;
    for (const e of sims) {
        const info = await getUserInfo(e.id)
        let socials = ""
        if (info.snapchat) socials += `Snapchat: ${info.snapchat}<br>`
        if (info.tiktok) socials += `TikTok: ${info.tiktok}<br>`
        if (info.instagram) socials += `Instagram: ${info.instagram}<br>`
        if (socials.length === 0) socials += "No social media listed<br>"
        dataToRender.similarities.push({
            number: number++,
            name: info.name,
            socials,
            similarity: e.similarity
        })
    }
    if (dataToRender.similarities.length == 0) {
        dataToRender.similarities.push({
            number: "ERROR",
            name: "No matches found!",
            socials: "Maybe your settings were too restrictive?<br>If everyone you know gets this message, call George :\\",
            similarity: 0
        })
    }
    const HTML = Mustache.render(template, dataToRender);
    const emailData = {
        to: currentDoc.email,
        subject: "Your Matchmaker results!"
    }
    if (isDryRun) {
        await writeFile(`./testEmails/${key}.html`, `<!-- ${JSON.stringify(emailData)} -->${HTML}`)
    } else {
        try {
            await mailer.send(generateEmail({ ...emailData, html: HTML }))
        } catch (e) {
            console.log("Error sending to " + emailData.to)
            console.log(e)
        }
    }
}

console.timeEnd('Sender ran in ')

console.log('Complete, now terminating...')
mongoose.disconnect()
console.log("See ya next year 😉")
process.exit(0)

async function getUserInfo(id) {
    const doc = await ResponseDoc.findById(id)
    return doc.info;
}

function generateEmail({subject, to, html}) {
    return {
        sender: process.env.EMAIL_FROM,
        content: {
            subject,
            html,
        },
        recipients: {
            to: [
                {
                    email: to,
                },
            ],
        },
    };
}