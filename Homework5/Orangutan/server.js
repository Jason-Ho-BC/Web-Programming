require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const surveysRouter = require('./routes/survey-router')
const app = express()

// Connect to the database

try {
    //mongoose.connect(process.env.DATABASE_URL);
    mongoose.connect('mongodb://localhost/surveys')
} catch (error) {
    console.log(error)
}

const db = mongoose.connection

db.on('error', (error) => {
    console.error(error)
})

db.once('open', () => {
    console.log('Connected to Database')
})

app.use(express.json())

app.use('/surveys', surveysRouter)

app.listen(3000, () => {
    console.log('Server started')
})