const msg = document.getElementById("hidden")
const button = document.getElementById("butt1")
const start = document.getElementById("new_game")
const grid = document.getElementById("butts")

let memory = []
let arr = []

let gameID = ""
let response = ""
let flag = ""
let url = ""
let clicks = 0
let arrLen = 0
let num = 0

// Get the game id from the server
async function getID() {
    let responseID = await fetch('/game', { method: 'POST' })
    let ID = await responseID.text()
    gameID = ID
    console.log(gameID)

    url = '/game/' + gameID

    getInfo()
}

// Get the sequence from the server
async function getInfo() {
    let responseID = await fetch(url, { method: 'GET' })
    let stuff = await responseID.json()
    arr = (stuff["currentSequence"])
    arrLen = arr.length

    flag = stuff.hasWon
    //console.log("Did I win? ", flag)

    // Check if you've won
    // If so display the messsage and disable the buttons
    if (flag) {
        toggleMsg()
        disableButts()
        return false
    }

    flash()
}

// Send the array sequence to the server
// If the sequence was correct then grab the new sequence
async function sendClick() {
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(memory)
    })
        .then(response => {
            //console.log("Request response: ", response.status)
            if ((response.status === 200) && (flag)) {
                return
            }
            if (response.status === 200) {
                getInfo()
            }
        })
}

// Toggle the "You Win!" message
function toggleMsg() {
    if (msg.style.display === "none") {
        msg.style.display = "block"
    }
    else {
        msg.style.display = "none"
    }
}

// Flash each button once with a delay in between
function flash() {
    arr.forEach(function (element, index) {
        setTimeout(function () {
            num = element
            const foo = document.getElementById("butt" + num)
            // Increase the brightness of the buttom
            foo.style.filter = "brightness(1.75)"

            // Set the brightness back to normal after 500ms
            setTimeout(() => {
                foo.style.filter = "brightness(1.00)"
            }, 500)
        }, index * 1000)
    })
}

// Record the clicks of the user
function recordClicks() {
    grid.onclick = function (event) {
        // Where was the click?
        let target = event.target;

        // Not a button? Then we're not interested
        if (target.tagName != 'BUTTON') return;

        // Grab the number of the button pressed
        let press = target.id[4]

        // Added the number to the array to be sent
        memory.push(press)
        clicks++

        // Check if we have the right number of clicks
        // If so send the array and reset clicks and the array
        if (clicks === arrLen) {
            //console.log("Array being sent: ", memory)
            sendClick()
            clicks = 0
            memory = []
        }
    }
}

// Enable buttons to be clicked
function enableButts() {
    const button = document.querySelectorAll('button')

    button.forEach(element => {
        if (element.disabled === true) {
            element.disabled = false
        }
    })
}

// Disabled buttons from being clicked
function disableButts() {
    const button = document.querySelectorAll('button')

    button.forEach(element => {
        element.disabled = true
    })

    start.disabled = false
}

// Start game button
// Reset defaults
// Enable buttons to be clicked
// Get game id and start recording clicks
start.onclick = event => {
    if (flag) {
        toggleMsg()
    }
    memory = []
    clicks = 0
    enableButts()
    getID()
    recordClicks()
}