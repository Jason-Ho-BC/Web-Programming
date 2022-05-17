const msg = document.getElementById("hidden")
const button = document.getElementById("butt1")
const start = document.getElementById("new_game")

const memory = []

function toggleMsg() {
    if (msg.style.display === "none") {
        msg.style.display = "block"
    }
    else {
        msg.style.display = "none"
    }
}

function buttonPress() {
    button.onclick = event => {
        toggleMsg()
    }
}



function start() {
    buttonPress()
}

start()