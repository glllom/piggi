let currentPlayers = [];
let currentTurn = 0; // index of array "currentPlayers"
let currentSum = 0;
let number = 0;
const goal = 100;
let onGame = false;
let timerToActivate;

/* AI strategy variables */
const recommendedThrows = 4;
const scoreToStop = 14;
const scoreToContinue = 10;
let aiTurns = 0;

function runGame() {
    onGame = true;
    console.log("New Game");
    // makes all variables to 0;
    currentPlayers = [];
    currentTurn = 0;
    currentSum = 0;
    number = 0;

    // creates players
    for (i = 1; i <= 4; i++) {
        let race = document.getElementById("player" + i + "_choise").value;
        switch (Number(race)) {
            case 1:
                currentPlayers.push(createPlayer("Player " + i, "human"));
                break;
            case 2:
                currentPlayers.push(createPlayer("Player " + i, "computer"));
                document.getElementsByClassName("player-container")[i - 1].classList.add("computer");
                break;
        }
    }
    arrangeDivs(currentPlayers.length);//creates and arranges all divs on html
    //shows/hides buttons
    document.getElementById("playerchoise").style.display = "none";
    document.getElementById("startgame").style.display = "none";
    document.getElementById("roll").style.display = "";
    document.getElementById("roll").disabled = false;
    document.getElementById("passturn").style.display = "";
    //make active-player
    currentTurn = Math.floor(Math.random() * currentPlayers.length);
    console.log("currentTurn: ", currentPlayers[currentTurn].name);
    makeActive();
    document.getElementById('passturn').disabled = true;
}


function createPlayer(name, race) {
    let player = {
        name: name,
        race: race,
        score: 0,
        currentThrows: []
    }
    return player;
}

function arrangeDivs(num) {
    let playerContainers = document.getElementsByClassName("player-container");
    if (num < 4)
        playerContainers[3].style.display = "none";
    else
        playerContainers[3].style.display = "";
    if (num < 3)
        playerContainers[2].style.display = "none";
    else
        playerContainers[2].style.display = "";


}

function makeActive() {
    if (!onGame)
        return
    active = document.getElementsByClassName("player-container")[currentTurn];
    for (pl of document.getElementsByClassName("player-container")) {
        pl.classList.remove("player-active");
    }
    active.classList.add("player-active");
    if (currentPlayers[currentTurn].race == "computer") { // compurer's turn
        console.log("Computer is thinking...")
        if (currentSum == 0)// first move in each turn goes faster
            setTimeout(computersTurn, 1000);
        else
            setTimeout(computersTurn, 3000);
        document.getElementById('passturn').disabled = true;
        document.getElementById('roll').disabled = true;
    }
    else {
        aiTurns = 0;
        document.getElementById('passturn').disabled = false;
        document.getElementById('roll').disabled = false;
    }

}

/*
 * Make a move
 */
function makeMove() {
    throwDice();
    if (number == 1) {
        eatScore(currentPlayers[currentTurn]);
        setTimeout(updateScore, 1000, currentPlayers[currentTurn].score);
        setTimeout(passTurn, 2500);
        return;
    }
    currentPlayers[currentTurn].currentThrows.push(number);
    currentSum += number;
    let espectedScore = currentPlayers[currentTurn].score + currentSum;
    console.log("score is: ", currentPlayers[currentTurn].score, " current score is: ", currentSum, " espectedScore = ", espectedScore);
    //update score
    setTimeout(updateScore, 1000, espectedScore);
    if (espectedScore >= goal) {
        setTimeout(gameOver, 1000, currentPlayers[currentTurn]);
    }
    return;
}

function updateScore(espectedScore) {
    document.querySelector(".player-active #player1Current").textContent = currentSum;
    document.querySelector(".player-active #player1Total").textContent = espectedScore;
}

/*
 *  Throws dice
 */
function throwDice() {
    disableButtons();
    let oldNumber = number;
    while (number == oldNumber) {
        number = Math.ceil(Math.random() * 6);
    }
    if (number == 1 && Math.random() < 0.5){// decreases chance of 1
        number = Math.ceil(Math.random() * 6);
    } 
   

    // rolling animation
    dice(number);
    document.getElementById('diceroll').play();
    console.log("Dice shows: ", number);
    // setTimeout(resetCube, 4000);
    if (currentPlayers[currentTurn].race != "computer")
        timerToActivate = setTimeout(activateButtons, 2000);
    return number;
}

function activateButtons() {
    if (currentPlayers[currentTurn].race != "computer") {
        document.getElementById("roll").disabled = false;
        document.getElementById("passturn").disabled = false;
    }
}

function disableButtons() {
    document.getElementById("roll").disabled = true;
    document.getElementById("passturn").disabled = true;
}
/*
 *  Pig eats current score in case number equal one
 */
function eatScore(player) {
    setTimeout(document.getElementById('pigsnort').play(), 4000)
    currentSum = 0;
    document.querySelector(".player-active #player1Total").textContent = currentPlayers[currentTurn].score;
    player.currentThrows = [];
    console.log("current score eaten");
}

/*
 *  Pass a turn
 */
function passTurn() {
    currentPlayers[currentTurn].score += currentSum;
    document.querySelector(".player-active #player1Current").textContent = 0;
    currentSum = 0;
    if (currentTurn < currentPlayers.length - 1)
        currentTurn++;
    else
        currentTurn = 0;
    console.log("currentTurn: ", currentPlayers[currentTurn].name);
    makeActive();
}

/*
 * Game over
 */
function gameOver() {
    
    setTimeout(function () {document.getElementById("victory").play();
    document.querySelector("#header>h1").textContent = `${currentPlayers[currentTurn].name} won!`;
    document.getElementById('gameEnd').style.display = 'block';}, 1500);
    console.log(`Game over. ${currentPlayers[currentTurn].name} won!`);
    disableButtons();
    clearTimeout(timerToActivate);
    onGame = false;
    mute();
    return;
}


/*
 * New Game
 */
function newGame() {
    mute();
    onGame = false;
    document.getElementById('gameEnd').style.display = 'none'
    arrangeDivs(4);
    currentSum = 0;

    //shows/hides buttons
    document.getElementById("playerchoise").style.display = "";
    document.getElementById("startgame").style.display = "";
    document.getElementById("roll").style.display = "none";
    document.getElementById("passturn").style.display = "none";
    //make active-player
    for (player of document.querySelectorAll(".player-container")) {
        player.classList.remove("player-active");
    }
    document.querySelectorAll("#player1Current").forEach(item => item.textContent = "");
    document.querySelectorAll("#player1Total").forEach(item => item.textContent = "");
    document.querySelector("#header>h1").textContent = "PIGGIES - A game of chance and greed";

}


// program to roll a dice to show at the end the random number
let cube = document.getElementById('gameCube');

//creating variables for the correct x and y position to show the number.
let one = 'rotateX(900deg) rotateY(900deg)';
let two = 'rotateX(90deg) rotateY(990deg)';
let three = 'rotateX(540deg) rotateY(450deg)';
let four = 'rotateX(1080deg) rotateY(450deg)';
let five = 'rotateX(990deg) rotateY(90deg)';
let six = 'rotateX(1260deg) rotateY(720deg)';



//the program which base on the random number assign the correct coordinates to show the right cube pattern
let dice = (number) => {
    document.getElementById('diceroll').play();
    switch (number) {
        case 1:
            cube.style.webkitTransform = `${one}`;
            cube.style.transform = `${one}`;
            break;
        case 2:
            cube.style.webkitTransform = `${two}`;
            cube.style.transform = `${two}`;
            break;
        case 3:
            cube.style.webkitTransform = `${three}`;
            cube.style.transform = `${three}`;
            break;
        case 4:
            cube.style.webkitTransform = `${four}`;
            cube.style.transform = `${four}`;
            break;
        case 5:
            cube.style.webkitTransform = `${four}`;
            cube.style.transform = `${five}`;
            break;
        case 6:
            cube.style.webkitTransform = `${six}`
            cube.style.transform = `${six}`;
            break;
    };
};

let resetCube = () => {
    return cube.style.transform = 'none';
};


//-----------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

function computersTurn() {
    if (!onGame)
        return
    console.log("computersTurn: ", aiTurns)
    if (computerPass()) {
        console.log(`${currentPlayers[currentTurn].name}(Computer) passes the move`);
        aiTurns = 0;
        passTurn();
        return;
    }

    throwDice();
    if (number == 1) {
        eatScore(currentPlayers[currentTurn]);
        setTimeout(updateScore, 1000, currentPlayers[currentTurn].score);
        setTimeout(passTurn, 3000);
        return;
    }

    currentPlayers[currentTurn].currentThrows.push(number);
    aiTurns++;
    currentSum += number;
    let espectedScore = currentPlayers[currentTurn].score + currentSum;
    console.log("score is: ", currentPlayers[currentTurn].score, " current score is: ", currentSum, " espectedScore = ", espectedScore);
    //update score
    setTimeout(updateScore, 1000, espectedScore);

    if (espectedScore >= goal) {
        aiTurns = 0;
        setTimeout(gameOver, 1000, currentPlayers[currentTurn]);
        return;
    }
    if (aiTurns == recommendedThrows && currentSum <= scoreToContinue)
        aiTurns--;

    if (aiTurns >= recommendedThrows) {
        aiTurns = 0;
        setTimeout(passTurn, 2500);
        console.log(`${currentPlayers[currentTurn].name}(Computer) passes the move`);
    }
    else
        setTimeout(makeActive, 1000);
}

function computerPass() {
    let risk = (Math.random() < 2);
    if (risk && currentSum >= scoreToStop)
        console.log(`${currentPlayers[currentTurn].name}(Computer) takes a risk`);
    return (currentSum >= scoreToStop) && risk // additional chance
}

/*********************************************AUDIO PLAYER************************************************ */
let volumeOff = () => {
    document.getElementsByTagName('audio').volume = 0;
};


function play() {
    var audio = document.getElementById("themeAudio");
    audio.play();
};

function mute() {
    var audio = document.getElementById("themeAudio");
    audio.pause();
};