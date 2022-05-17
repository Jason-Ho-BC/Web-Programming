const msg = document.getElementById("hidden")
const button = document.getElementById("butt1")
const start = document.getElementById("new_game")

const memory = []

function showMsg() {
    if (toggleButton.innerText === 'Show') {
        toggleButton.innerText = 'Hide'
    } else {
        toggleButton.innerText = 'Show'
    }



}

function buttonPress() {
    button.onclick = event => {
        showMsg()
    }
}

function start() {
    start.onclick = event => {

    }
}