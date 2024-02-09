const express = require('express')
const { ResponseDoc, Question } = require('./schemas')

const mongoose = require('mongoose')
let questions = []

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGO_URI)

const app = express()
console.log('init')

app.use(express.static('public'))

app.get('/api/questions', async (req, res) => {
    if (questions.length === 0) {
        const questionDownload = await Question.find({})
        questions = questionDownload;
        return res.status(200).send(questions)
    } else {
        return res.status(200).send(questions)
    }
}) 

app.post('/api/results', express.json(), async (req, res) => {
    try {
        const newDoc = new ResponseDoc(req.body);
        await newDoc.save()
        return res.status(200).send({status: "success", message: "User data submitted"})
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).send({status: "error", message: "This email already submitted a response"})
        } else if (e.errors !== undefined) {
            return res.status(400).send({status: "error", message: Object.values(e.errors).map(z => z.message).join(', ')})
        } else {
            return res.status(500).send({status: "error", message: e.toString()})
        }
    }
})

app.get('/api/emailExists', async (req, res) => {
    try {
        const {email} = req.query;
        const foundDoc = await ResponseDoc.findOne({"info.email": email})
        if (foundDoc === null) {
            return res.status(200).send({exists: false})
        } else {
            return res.status(200).send({exists: true})
        }
    } catch (e) {
        return res.status(500).send({status: "error", message: e})
    }
})

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(process.env.PORT || 4000, () => console.log('listening'))