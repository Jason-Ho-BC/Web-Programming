const { response } = require('express')
const express = require('express')
const router = express.Router()
const Survey = require('../models/survey')

// Create a survey
// if it does't already exist
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

    // Check if it already exists
    const surveyCount = await Survey.find({
        name: req.body.name
    })

    // If it doesn't exist
    // then create it 
    try {
        if (surveyCount.length === 0) {
            const newSurvey = await survey.save()
            res.status(201).json(newSurvey)
        }
        else {
            res.json({ message: "A survey with that name already exists." })
        }
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
        // Get all the surveys using find
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
router.put('/:id/question', getSurvey, async (req, res) => {
    try {
        // Check if the survey is already published or not
        // If not then change the survey with the new quesiton
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
router.put('/:id/status', getSurvey, async (req, res) => {
    try {
        // Check if the survey is published already
        // If not set the survey to published
        if (res.survey.published === false) {
            res.survey.published = req.body.published
            const updatedSurvey = await res.survey.save()
            res.json(updatedSurvey)
        }
        else {
            res.json({ message: "The survey is already published" })
        }
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
router.put('/:id/user', getSurvey, async (req, res) => {
    var responses = res.survey.responses
    var userName = req.body.responses['name']
    var userChoice = req.body.responses['choice']
    var flag = false

    try {
        // Check if user exists
        responses.forEach(element => {
            if (element['name'] === userName) {
                flag = true
            }
        });

        // If the user exists then send them a message
        if (flag === true) {
            res.json({ message: "You have already submitted a response" })
        }
        else {
            var answerArr = res.survey.question['answers']
            // Check if the answer already exists
            // If so add response to survey
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
router.delete('/:id/:name/delete', getSurvey, async (req, res) => {
    var userName = req.params.name
    var users = res.survey.responses
    var flag = false
    var userId

    try {
        // Check if user exists
        // If so grab their id
        users.forEach(element => {
            if (element['name'] === userName) {
                flag = true
                userId = element.id
                return
            }
        });

        // Remove the user using their id
        if (flag === true) {
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
router.get('/:id/responses', getSurvey, async (req, res) => {
    var answerArr = res.survey.question['answers']
    var results = []

    try {
        // Filter for each answer and count the number of them
        await answerArr.forEach(element => {
            var result = res.survey.responses.filter(answer => answer.choice === element).length

            // Create new object to store 
            let temp = {
                [element]: result
            }

            //Add the object into the array
            results.push(temp)
        });
        res.json(results)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Middleware
// Use the given id and return a survey
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