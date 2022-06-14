const mongoose = require('mongoose')

const surverySchema = new mongoose.Schema({
    // Name of survey
    name: {
        type: String,
        required: true
    },

    // Date created
    dateCreated: {
        type: Date,
        default: Date.now
    },

    // Date closes
    dateCloses: {
        type: Date,
        required: true
    },

    // Name of the user who created it
    owner: {
        type: String,
        required: true
    },

    // Published status
    published: {
        type: Boolean,
        default: false
    },

    // One question with prompt and list of possible answers
    question: {
        prompt: { type: String, required: true },
        answers: [{ type: String, required: true }],
    },

    // User responses
    responses: [{
        name: { type: String },
        choice: { type: String }
    }]
})

module.exports = mongoose.model('Survey', surverySchema)