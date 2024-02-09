const mongoose = require('mongoose')

const ResponseDoc = mongoose.model('responses', {
    info: {
        name: {
            type: String,
            required: "Response requires a name",
            validate: {
                validator: (e) => /[a-zA-Z]+/.test(e),
                message: _ => "Name supplied is invalid"
            }
        },
        email: {
            type: String,
            unique: true,
            required: "Response requires an email",
            validate: {
                validator: (e) => /[0-9]{2}.+@woodward\.edu/.test(e),
                message: _ => `Email supplied is invalid. Make sure it comes from an @woodward.edu domain`
            }
        },
        snapchat: String,
        instagram: String,
        tiktok: String,
        looking: {
            type: String,
            required: "You need to specify if you are looking for a match",
            validate: {
                validator: (e) => /(Yes|No)/.test(e),
                message: _ => `Provided answer is invalid`
            }
        },
        _id: {
            type: String,
            required: "Response requires a WADaily account",
        },
        inGrade: {
            type: String,
            required: "You need to specify a grade level",
            validate: {
                validator: (e) => /(9|10|11|12)th/.test(e),
                message: _ => `Grade supplied is invalid`
            }
        },
        desiredGrades: {
            type: Array,
            required: "You need to specify desired grade levels for matching",
            validate: {
                validator: (e) => e.filter(x => !/(9|10|11|12)th/.test(x)).length === 0,
                message: _ => `Desired grade levels provided are invalid`
            }
        },
        gender: {
            type: String,
            required: "You need to specify a gender",
            validate: {
                validator: (e) => /(man|woman|other)/.test(e),
                message: _ => `Provided gender is invalid`
            }
        },
        desiredGenders: {
            type: Array,
            required: "You need to specify desired genders for matching",
            validate: {
                validator: (e) => e.filter(x => !/(man|woman|other)/.test(x)).length === 0,
                message: _ => `Provided desired genders are invalid`
            }
        }
    },
    responses: {
        type: Object,
        required: "You need to provide question responses",
        validate: {
            validator: (e) => Object.entries(e).filter(([key, val]) => Number.isNaN(parseInt(key)) || typeof(val) !== 'number' ).length === 0,
            message: _ => `Supplied responses do not match questions on server.`
        }
    }
})

const Question = mongoose.model('questions', {
    title: String,
    id: {
        type: Number,
        unique: true
    },
    responses: [{title: String, id: Number}]
})

module.exports = {
    ResponseDoc,
    Question
}