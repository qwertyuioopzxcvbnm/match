import { ResponseDoc } from "./schemas.js"
import mongoose from 'mongoose'
import {config} from 'dotenv'
import {writeFile} from 'fs/promises'

//If this option is set, the resulting JSON will include the names of individuals
//This feature is important but I forgot why
const shouldShowNamesInResult = process.argv.includes("-n")
if (shouldShowNamesInResult) console.log("ENVIRONMENT - Names will appear in result")

//This option enables logging debug features for testing
const inTesting = process.argv.includes("-d")
if (inTesting) console.log("ENVIRONMENT - Debug logs will appear")

//This option ignores genders and grades when matching
//useful for testing with limited data
const dontEvaluateExtras = process.argv.includes("-e")
if (dontEvaluateExtras) console.log("ENVIRONMENT - Extra parameters (grade and gender) are ignored")

//This is the worst thing i've ever written
//I am so sorry to the next maintainer

//Heads up! .mjs extension makes this file a "module". 
//Read relevant NodeJS documentation before importing things

console.log('WADaily Matcher™')
console.log('"it sucks" - George')
console.log('Copyright © 2022 George Parks')
console.log()
console.log('Connecting to database...')
//loads env variables from .env file if present
config()
mongoose.connect(process.env.MONGO_URI)
console.log('Loading responses')
const responses = await ResponseDoc.find()
console.log('Responses found, preparing ✨ algorithm ✨')

//This literally runs in over O(n^2) and I have no clue how to make it faster??
//There has to be a better way to do this

//starts timer to see how long this takes
console.log("0% complete")
console.time('Algorithm ran in ')

const result = {}

for (const [i, response] of responses.entries()) {
    replaceLastLine(`${Math.floor(i/responses.length * 100)}% complete`)

    //stores similarity data between individuals
    let similarities = []
    responses.forEach(e => {

        //don't run algorithm for same user
        if (e._id == response._id) return;

        //don't run algorithm for people whose gender preferences don't match
        if (!dontEvaluateExtras) {
            if (!response.info.desiredGrades.includes(e.info.inGrade) || 
                !response.info.desiredGenders.includes(e.info.gender) ||
                !e.info.desiredGrades.includes(response.info.inGrade) || 
                !e.info.desiredGenders.includes(response.info.gender)
                ) return;
        }


        //compares current document and looped document
        const similarityScore = compare(response.responses, e.responses)
        //adds the information to the similarities array
        //Includes a name if the argument is passed
        if (shouldShowNamesInResult) {
            similarities.push({name: e.info.name, id: e.id, similarity: similarityScore})
        } else {
            similarities.push({id: e.id, similarity: similarityScore})
        }
    })
    //sorts the similarities array to be greatest to least similarity
    similarities.sort((a, b) => b.similarity - a.similarity)
    //sets the response id on the results to be the top three listings in the sorted array
    //if the shouldShowName flag (-n) is set, the JSON file will contain an object of objects rather than an object of arrays
    result[response.id] = shouldShowNamesInResult ? 
        {name: response.info.name, similarities: similarities.slice(0, 5)} : 
        similarities.slice(0, 5)
    
}
replaceLastLine("");
console.timeEnd('Algorithm ran in ')

console.log("Saving to disk 💾")
await writeFile("results.json", JSON.stringify(result))

console.log('Complete, now terminating...')
mongoose.disconnect()
console.log("See ya next year 😉")
process.exit(0)

//Compares two response objects
//Precondition: Must be of same length and follow schema outlined in schemas.js
function compare(o1, o2) {
    let similarities = 0;
    //returns first object as an array following the shape [ [key, value]... ]
    const entries = Object.entries(o1);
    //loop over each and destructure to turn [key, value] into key and value variables
    entries.forEach(([key, val]) => {
        //checks strict equality since responses should always be represented by numbers
        if (o2[key] === val) {
            similarities++
        }
    })
    //returns percent similarity as integer to avoid floating math voodoo
    return Math.round((similarities / entries.length) * 100)
}

//replaces last console line with new text
function replaceLastLine(text) {
    if (!inTesting) {
        process.stdout.moveCursor(0, -1) // up one line
        process.stdout.clearLine(1) // from cursor to end
    }
    console.log(text)
}