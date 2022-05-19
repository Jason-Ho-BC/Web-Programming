const msg = document.getElementById("hidden")
const button = document.getElementById("butt1")
const start = document.getElementById("new_game")
const grid = document.getElementById("fuck")

let memory = []
let arr = []

let gameID = ""
let response = ""
let flag = ""
let url = ""
let clicks = 0
let arrLen = 0
let num = 0

async function getInfo() {
    let responseID = await fetch(url, { method: 'GET' })
    let stuff = await responseID.json()
    arr = (stuff["currentSequence"])
    arrLen = arr.length

    flag = stuff.hasWon
    console.log(flag)

    // This is some weird stuff going on
    // Found it on stackoverflow but it works
    arr.forEach(function (element, index) {
        setTimeout(function () {
            //console.log(stuff)
            console.log(arr)
            console.log(element)
            num = element
            flash()
        }, index * 1000)
    })
}

async function getID() {
    let responseID = await fetch('/game', { method: 'POST' })
    let ID = await responseID.text()
    gameID = ID
    console.log(gameID)

    url = '/game/' + gameID

    getInfo()
}

async function sendClick() {
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(memory)
    })
        .then(response => {
            console.log(response.status)
            if (response.status === 200) {
                getInfo()
            }
        })
}

function toggleMsg() {
    if (msg.style.display === "none") {
        msg.style.display = "block"
    }
    else {
        msg.style.display = "none"
    }
}

function flash() {
    const foo = document.getElementById("butt" + num)
    foo.style.filter = "brightness(1.75)"

    setTimeout(() => {
        foo.style.filter = "brightness(1.00)"
    }, 500)
}

start.onclick = event => {
    memory = []
    clicks = 0
    getID()
    recordClicks()
}

function recordClicks() {
    grid.onclick = function (event) {
        let target = event.target; // where was the click?

        if (target.tagName != 'BUTTON') return; // not on TD? Then we're not interested

        let correct = "butt" + num
        console.log(correct)

        console.log(event.target.id)

        arr.forEach(element => {
            if (event.target.id === correct) {
                memory.push(num)
                clicks++
            }
        })

        if (clicks === arrLen) {
            sendClick()
            clicks = 0
            memory = []
            getInfo()
        }
    }
}
