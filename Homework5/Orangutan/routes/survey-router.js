const { response } = require('express')
const express = require('express')
const router = express.Router()
const Survey = require('../models/survey')

// Create a survey
router.post('/', async (req, res) => {
    const survey = new Survey({
        name: req.body.name,
        dateCreated: req.body.dateCreated,
        dateCloses: req.body.dateCloses,
        owner: req.body.owner,
        published: req.body.published,
        question: req.body.question,
        responses: req.body.responses
    })

    try {
        const newSurvey = await survey.save()
        res.status(201).json(newSurvey)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// List all surveys
router.get('/', async (req, res) => {
    try {
        const surveys = await Survey.find()
        res.json(surveys)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// List all surveys that are published but not closed
router.get('/current', async (req, res) => {
    var currentDate = new Date()

    try {
        //const surveys = await Survey.find({ "published": true }, { dateCloses: { $gt: Date.now } })
        const surveys = await Survey.find({
            dateCloses: { $gt: currentDate },
            published: true
        })
        res.json(surveys)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get all details of one survey
router.get('/:id', getSurvey, async (req, res) => {
    res.json(res.survey)
})

// Change the question of an unpublished survey
router.patch('/question/:id', getSurvey, async (req, res) => {
    try {
        if (res.survey.published === false) {
            res.survey.question['prompt'] = req.body.question['prompt']
            const updatedSurvey = await res.survey.save()
            res.json(updatedSurvey)
        }
        else {
            res.json({ message: "Survey is published" })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Set a survey from unpublised to published
router.patch('/status/:id', getSurvey, async (req, res) => {
    res.survey.published = req.body.published

    try {
        const updatedSurvey = await res.survey.save()
        res.json(updatedSurvey)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Delete a survey
router.delete('/:id', getSurvey, async (req, res) => {
    try {
        await res.survey.remove()
        res.json({ message: 'Deleted Survey' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Create a response to a survey
// if the same user hasn't already submitted a response
// and the choice exists
router.patch('/user/:id', getSurvey, async (req, res) => {
    var responses = res.survey.responses
    var userName = req.body.responses['name']
    var userChoice = req.body.responses['choice']

    try {
        // Check if user exists
        const searchUser = await Survey.find({
            responses: {
                "$elemMatch": { 'name': userName }
            }
        })

        if (searchUser.length != 0) {
            res.json({ message: "You have already submitted a response" })
        }
        else {
            // Check if the answer exists
            var answerArr = res.survey.question['answers']

            // Add response to survey
            if (answerArr.includes(userChoice) === true) {
                responses.push(req.body.responses)
                const updatedSurvey = await res.survey.save()
                res.json(updatedSurvey)
            }
            else {
                res.json({ message: "Not a valid choice" })
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Delete a given user's response
router.patch('/user/delete/:id', getSurvey, async (req, res) => {
    var userName = req.body.responses['name']
    var users = res.survey.responses
    var userId
    //console.log(users)

    try {
        // Check if user exists
        const searchUser = await Survey.find({
            responses: {
                "$elemMatch": { 'name': userName }
            }
        })

        if (searchUser.length != 0) {
            // Get the id of the given name
            users.forEach(element => {
                if (element.name === userName) {
                    userId = element.id
                    return
                }
            });

            // Remove the user
            res.survey.responses.pull(userId)
            const updatedSurvey = await res.survey.save()
            res.json(updatedSurvey)
        }
        else {
            res.json({ message: "You don't exist" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get a count of the number of responses with each answer
router.get('/responses/:id', getSurvey, async (req, res) => {
    var answerArr = res.survey.question['answers']
    var results = []
    //console.log(answerArr)

    try {
        // Filter for each answer and count the number of them
        await answerArr.forEach(element => {
            var result = res.survey.responses.filter(answer => answer.choice === element).length
            results.push(result)

            console.log(element + ": " + result)
        });
        //console.log(results)
        return
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Middleware
// Gets the id of a survey
async function getSurvey(req, res, next) {
    var survey

    try {
        survey = await Survey.findById(req.params.id)
        if (survey == null) {
            return res.status(404).json({ message: 'Cannot find survey' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.survey = survey
    next()
}

module.exports = router