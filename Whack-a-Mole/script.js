// Access elements

const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#timeLeft');
const maxScoreDisplay = document.querySelector('#maxScore');
const startBtn = document.querySelector('#startBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const resumeBtn = document.querySelector('#resumeBtn');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');

// ============================================================ //
//               TASK DOM ELEMENTS ADDED                        //
// ============================================================ //

const hitMsg = document.querySelector('#hitMessage');   // For "Whack!"
const hitsDisplay = document.querySelector('#hits');    // Hit Counter
const lastGameDisplay = document.querySelector('#lastGame'); // Last game score
const fastestDisplay = document.querySelector('#fastest');   // Fastest Hit

// Variables

let score = 0;
let time = 30;
let bestScore = 0;
let playGame = false;
let paused = false;
let gameId = null;
let moleTimeout = null;

// ============================================================ //
//        TASK -- 5 Variable + TASK -- 8 Variable               //
// ============================================================ //

let hits = 0;               // Hit Counter
let moleStartTime = 0;      // For fastest hit tracking


// Load game data

function webLoad() {
    onLoad();
    displayContent();
}

function onLoad() {
    const temp = localStorage.getItem('highScoreMole');
    bestScore = temp ? parseInt(temp) : 0;

    // ============================================================ //
    //          TASK -- 7 :: Display Last Game Score                //
    // ============================================================ //

    const last = sessionStorage.getItem('lastScore');
    if (last) {
        lastGameDisplay.textContent = "Last Game: " + last;
    }

    // ============================================================ //
    //       TASK -- 8 :: Show Fastest Hit on Page Load             //
    // ============================================================ //

    const fastest = sessionStorage.getItem('fastestHit');
    if (fastest) {
        fastestDisplay.textContent = "Fastest: " + fastest + "ms";
    }
}

function displayContent() {
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = time;
    maxScoreDisplay.textContent = bestScore;

    // ============================================================ //
    //        TASK -- 1 :: Score Turns Gold When > 50               //
    // ============================================================ //

    if (score > 50) {
        scoreDisplay.style.color = "gold";
    } else {
        scoreDisplay.style.color = "white";
    }
}

// Start Game

function startGame() {

    score = 0;
    time = 30;
    playGame = true;
    paused = false;

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;

    // ============================================================ //
    //        TASK -- 5 Reset Hit Counter                           //
    // ============================================================ //

    hits = 0;
    hitsDisplay.textContent = "Hits: 0";

    // ============================================================ //
    //        TASK -- 7 Clear Last Game Score on Start              //
    // ============================================================ //

    lastGameDisplay.textContent = "";

    enableClicks(true);
    hideAllMoles();
    popGame();

    gameId = setInterval(() => {
        if (!paused) {

            time--;
            if (time <= 0) {
                endGame();
            }
            displayContent();

        }
    }, 1000);

}

// Pop Mole Logic

function randomTime(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    return holes[index];
}

function popGame() {

    // ============================================================ //
    //        TASK -- 4 Mole Speed Increases When < 10 sec          //
    // ============================================================ //

    let minTime = 500;
    let maxTime = 1500;

    if (time < 10) {
        minTime = 300;
        maxTime = 800;
    }

    const timer = randomTime(minTime, maxTime);

    const hole = randomHole();
    const mole = hole.querySelector('.mole');

    if (playGame && !paused) {

        mole.classList.add('up');

        // ============================================================ //
        //        TASK -- 8 Start Timer For Fastest Hit                 //
        // ============================================================ //

        moleStartTime = Date.now();

        moleTimeout = setTimeout(() => {
            mole.classList.remove('up');
            popGame();
        }, timer);

    }
}

// Whack Mole

function bonk(event) {

    if (!event.isTrusted || !playGame || paused) return;

    if (event.target.classList.contains('up')) {

        score++;
        event.target.classList.remove('up');
        event.target.classList.add('bonked');

        // ============================================================ //
        //        TASK -- 2 Show "Whack!" Message                       //
        // ============================================================ //

        hitMsg.textContent = "Whack!";
        setTimeout(() => hitMsg.textContent = "", 300);

        // ============================================================ //
        //        TASK -- 5 Hit Counter                                 //
        // ============================================================ //

        hits++;
        hitsDisplay.textContent = "Hits: " + hits;

        // ============================================================ //
        //        TASK -- 8 Fastest Hit Timer                           //
        // ============================================================ //

        let timeTaken = Date.now() - moleStartTime;
        let fastest = sessionStorage.getItem('fastestHit');

        if (!fastest || timeTaken < fastest) {
            sessionStorage.setItem('fastestHit', timeTaken);
        }

        fastestDisplay.textContent =
            "Fastest: " + sessionStorage.getItem('fastestHit') + "ms";

        setTimeout(() => {
            event.target.classList.remove('bonked');
            displayContent();
        }, 300);
    }
}

// Pause Game

function pauseGame() {

    paused = true;

    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
    startBtn.disabled = true;

    enableClicks(false);
    clearTimeout(moleTimeout);

    hideAllMoles();

}

// Resume Game

function resumeGame() {

    paused = false;

    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
    startBtn.disabled = true;

    enableClicks(true);
    popGame();

}

// End Game

function endGame() {
    
    clearInterval(gameId);
    clearTimeout(moleTimeout);

    playGame = false;
    paused = false;

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;

    hideAllMoles();
    enableClicks(false);

    // ============================================================ //
    //     TASK -- 7 Save Last Game Score in SessionStorage          //
    // ============================================================ //

    sessionStorage.setItem('lastScore', score);
    lastGameDisplay.textContent = "Last Game: " + score;

    if (score > bestScore) {
        
        bestScore = score;
        localStorage.setItem('highScoreMole', bestScore);

        const highScoreAudio = new Audio('victory.mp3');
        highScoreAudio.play();

        // ============================================================ //
        //     TASK -- 6 Glow When New Record is Made                   //
        // ============================================================ //

        maxScoreDisplay.style.textShadow = "0 0 10px yellow";
        setTimeout(() => {
            maxScoreDisplay.style.textShadow = "none";
        }, 1000);

        alert(` New High Score: ${score}!`);

    } else {

        alert(`Your score: ${score}`);
    }

    // ============================================================ //
    //        TASK -- 3 Change Start Button To "Play Again"          //
    // ============================================================ //

    startBtn.innerText = "Play Again";

    displayContent();
}

// Hide all moles instantly

function hideAllMoles() {
    moles.forEach(mole => {
        mole.classList.remove('up', 'bonked');
    });
}

// Enable/Disable Clicks

function enableClicks(enable) {
    if (enable) {
        moles.forEach(mole => mole.style.pointerEvents = 'auto');
    } 
    else {
        moles.forEach(mole => mole.style.pointerEvents = 'none');
    }
}

// Event Listeners

webLoad();

moles.forEach(mole => mole.addEventListener('click', bonk));
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resumeBtn.addEventListener('click', resumeGame);
