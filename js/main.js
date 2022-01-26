let canv;
let ctx;
let timerDiv;

const CARD_HEIGHT = 70;
const CARD_WIDTH = 50;

const CARDS_AMOUNT_EASY = 16;
const CARDS_AMOUNT_MEDIUM = 36;
const CARDS_AMOUNT_HARD = 64;

const config = {
    name: findGetParameter("name"),
    difficulty: +findGetParameter("diff")
}

let cardsAmount;
let cards = [];
let game = false;
let timePassed = 0;
let turns = 0;
let cardsUncovered;
let testing = (findGetParameter("name") === "tester") ? 1 : 0;
let timer;
let drawing;

function main() {

    init();
    generateCards();
    shuffleCards();

    drawing = setInterval(() => {
        draw();
    }, 200);

    let cardOpened = null;
    let timeOut = false;

    canv.addEventListener("click", function(e) {
        if (timeOut) {
            return;
        }

        if (!game) {
            game = 1;

            timer = startTimer();
        }

        let card = drawFace(e.offsetX, e.offsetY);
        card.opened = true;
        if (cardOpened != null && cardOpened.type === card.type && cardOpened !== card) {
            cardOpened.uncovered = true;
            card.uncovered = true;
            cardOpened = null;
            turns++;
            cardsUncovered -= 2;
            winCheck();
        }
        else if (cardOpened == null) {
            cardOpened = card;
        }
        else if (cardOpened.type !== card.type) {
            turns++;
            timeOut = true;
            setTimeout(() => {
                cardOpened.opened = false;
                cardOpened = null;
                card.opened = false;
                timeOut = false;
            }, 700);
        }
    });

}

function init() {
    canv = document.getElementById("canv");
    ctx = canv.getContext("2d");
    timerDiv = document.getElementsByClassName("timer")[0];
    timerDiv.innerHTML = "Времени прошло: 00:00";
    let container = document.getElementsByClassName("container")[0];

    cardsAmount = 0;

    if (config.difficulty === 0) {
        let sq = Math.sqrt(CARDS_AMOUNT_EASY);
        canv.width = CARD_WIDTH * sq;
        canv.height = CARD_HEIGHT * sq;

        cardsAmount = CARDS_AMOUNT_EASY;
    }
    else if (config.difficulty === 1) {
        let sq = Math.sqrt(CARDS_AMOUNT_MEDIUM);
        canv.width = CARD_WIDTH * sq;
        canv.height = CARD_HEIGHT * sq;

        cardsAmount = CARDS_AMOUNT_MEDIUM
    }
    else if (config.difficulty === 2) {
        let sq = Math.sqrt(CARDS_AMOUNT_HARD);
        canv.width = CARD_WIDTH * sq;
        canv.height = CARD_HEIGHT * sq;

        cardsAmount = CARDS_AMOUNT_HARD;
    }
    else {
        alert("Не ломайте игру");
        window.location = "index.html";
    }

    cardsUncovered = cardsAmount;

    container.style.width = canv.width + 300 + "px";
}

function generateCards() {
    let rowSize = Math.sqrt(cardsAmount);
    for (let i = 0; i < rowSize; i++) {
        for (let j = 0; j < rowSize; j++) {
            let card = {
                type: Math.trunc((i * rowSize + j) / 2),
                row: i,
                col: j,
                uncovered: false,
                opened: false
            }

            cards.push(card);
        }
    }
}

function shuffleCards() {
    let rowSize = Math.sqrt(cardsAmount);
    for (let j = 0; j < 10; j++) {
        for (let i = 0; i < rowSize; i++) {
            let el = cards[Math.floor(Math.random() * cards.length)];
            let tempR = cards[i].row;
            let tempC = cards[i].col;

            cards[i].row = el.row;
            cards[i].col = el.col;

            el.row = tempR;
            el.col = tempC;
        }
    }
}

function draw() {
    cards.forEach((card) => {
        let x = card.col * CARD_WIDTH;
        let y = card.row * CARD_HEIGHT;
        if ((card.row % 2 === 0 && card.col % 2 === 0) || (card.row % 2 !== 0 && card.col % 2 !== 0)) {
            if (card.opened && !card.uncovered) {
                drawRectangle(x, y, CARD_WIDTH, CARD_HEIGHT, "#4d4d4d");
            }
            else {
                drawRectangle(x, y, CARD_WIDTH, CARD_HEIGHT, "#000");
            }

        }
        else {
            if (card.opened && !card.uncovered) {
                drawRectangle(x, y, CARD_WIDTH, CARD_HEIGHT, "#d4d4d4");
            }
            else {
                drawRectangle(x, y, CARD_WIDTH, CARD_HEIGHT, "#e6e6e6");
            }
        }

        if (card.uncovered || card.opened || testing) {
            drawFace(x, y);
        }
    });
}

function drawFace(x, y) {
    let row = Math.floor(y / CARD_HEIGHT);
    let col = Math.floor(x / CARD_WIDTH);

    let card = null;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].row === row && cards[i].col === col) {
            card = cards[i];
            break;
        }
    }

    if (card !== null) {
        let fontSize = CARD_HEIGHT / 3;
        ctx.font = fontSize + "px Arial";

        let drawX = col * CARD_WIDTH;
        let drawY = row * CARD_HEIGHT;

        if (((card.row % 2 === 0 && card.col % 2 === 0) || (card.row % 2 !== 0 && card.col % 2 !== 0)) && !card.uncovered) {
            drawRectangle(drawX, drawY, CARD_WIDTH, CARD_HEIGHT, "#4d4d4d");
        }
        else if (!card.uncovered) {
            drawRectangle(drawX, drawY, CARD_WIDTH, CARD_HEIGHT, "#d4d4d4");
        }

        ctx.fillStyle = "#8659ff";
        if (testing && (card.opened || card.uncovered)) {
            ctx.fillStyle = "#fcba03";
        }

        if (card.uncovered) {
            ctx.fillStyle = "#00c417";
        }
        ctx.fillText(card.type + 1, drawX + CARD_WIDTH / 2 - fontSize / 2, drawY + fontSize + CARD_HEIGHT / 4);
    }
    return card;
}

function winCheck() {
    if (cardsUncovered === 0) {
        clearInterval(timer);
        setTimeout(() => {
            clearInterval(drawing);
        }, 300);

        let name = config.name;

        let record = {
            difficulty: config.difficulty,
            timePassed: timePassed,
            turns: turns
        }

        if (window.localStorage.getItem(config.name) !== null) {
            for (let i = 1; i < 1000000000; i++) {
                if (window.localStorage.getItem(config.name + " (" + i + ")") == null) {
                    window.localStorage.setItem(config.name + " (" + i + ")", JSON.stringify(record));
                    name = config.name + " (" + i + ")";
                    break;
                }
            }
        }
        else {
            window.localStorage.setItem(config.name, JSON.stringify(record));
        }

        setTimeout(() => {
            window.location = "scores.html?name=" + name + "&difficulty=" + config.difficulty;
        }, 500);
    }
}

function drawRectangle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function startTimer() {
    return setInterval(() => {
        timePassed++;
        let mins = Math.floor(timePassed / 60);
        let secs = timePassed % 60;
        if (secs < 10) {
            secs = "0" + secs;
        }
        if (mins < 10) {
            mins = "0" + mins;
        }
        timerDiv.innerHTML = "Времени прошло: " + mins + ":" + secs;
    }, 1000);
}
