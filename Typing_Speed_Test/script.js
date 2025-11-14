// DOM Elements
const textDisplay = document.querySelector('#textDisplay');
const typingArea = document.querySelector('#typingArea');
const timerDisplay = document.querySelector('#timer');
const wpmDisplay = document.querySelector('#wpm');
const accuracyDisplay = document.querySelector('#accuracy');
const bestWPMDisplay = document.querySelector('#bestWPM');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');

// EXTRA TASK DISPLAY (You must add this in HTML)
const lastTestDisplay = document.querySelector('#lastTest');
const fastStartDisplay = document.querySelector('#fastStart');

// Test texts
const testTexts = [
    "The quick brown fox jumps over the lazy dog. This famous sentence is a pangram, containing every single letter of the alphabet.",
    "To type faster, you need to practice regularly with correct form. Consistency is more important than the length of your daily sessions.",
    "Computers have changed our world forever. We use them for work, school, and play every single day. They are vital to modern life."
];

// Game state
let currentText = '';
let timeLeft = 60;
let timerInterval = null;
let startTime = null;
let bestWPM = 0;
let wpm = 0;

// ============================================================ //
// TASK VARIABLES
// ============================================================ //
let pauseTimer = null;          // Task 3 idle typing
let firstSpaceHappened = false; // Task 4
let firstFiveStart = null;      // Task 8 start time for first 5 chars
let storedFastStart = null;     // Task 8


function webLoad() {
    onLoad();
    displayContent();
}

function onLoad() {
    const temp = sessionStorage.getItem('bestWPM');
    bestWPM = temp ? parseInt(temp) : 0;

    //================================================================//
    //                   TASK 7 :: Load Last Test WPM                 //
    //================================================================//

    const last = sessionStorage.getItem('lastWPM');
    if (last && lastTestDisplay) {
        lastTestDisplay.textContent = `Last Test: ${last} WPM`;
    }

    //================================================================//
    //                 TASK 8 :: Load Fastest Start                   //
    //================================================================//

    storedFastStart = sessionStorage.getItem('fastStart');
    if (storedFastStart && fastStartDisplay) {
        fastStartDisplay.textContent = `Fastest Start: ${storedFastStart} ms`;
    }
}

function displayContent() {
    timerDisplay.textContent = timeLeft;
    bestWPMDisplay.textContent = bestWPM;
}

webLoad();


function endGame() {
    clearInterval(timerInterval);
    timeLeft = 60;
    startBtn.disabled = false;

    //================================================================//
    //                    TASK 7 :: Save Last WPM                     //
    //================================================================//
    sessionStorage.setItem('lastWPM', wpm);
    if (lastTestDisplay) lastTestDisplay.textContent = `Last Test: ${wpm} WPM`;

    if (wpm > bestWPM) {
        bestWPM = wpm;
        sessionStorage.setItem('bestWPM', bestWPM);

        //================================================================//
        //             TASK 5 :: Highlight New Personal Best              //
        //================================================================//

        bestWPMDisplay.style.color = 'red';
        bestWPMDisplay.style.fontWeight = 'bold';

        alert(` New high score! Your WPM: ${wpm}`);
    } else {
        alert(`Your score: ${wpm} WPM`);
    }

    wpm = 0;
    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = "100%";
    typingArea.disabled = true;
    typingArea.value = "";
    displayContent();

    // Reset effects
    timerDisplay.style.color = "black";
    timerDisplay.style.fontSize = "2em";
    wpmDisplay.style.fontWeight = "normal";
    accuracyDisplay.style.color = "black";
}

function startGame() {
    timeLeft = 60;
    startBtn.disabled = true;
    currentText = testTexts[Math.floor(Math.random() * testTexts.length)];
    textDisplay.textContent = currentText;

    typingArea.disabled = false;
    typingArea.value = "";
    typingArea.focus();
    typingArea.setAttribute('placeholder', 'Start typing here...');

    startTime = null;
    firstSpaceHappened = false; // reset for TASK 4
    firstFiveStart = null;      // reset for TASK 8

    timerInterval = setInterval(() => {
        timeLeft--;

        //================================================================//
        // ================ TASK 6 :: Timer Warning =================
        //================================================================//
        if (timeLeft <= 10) {
            timerDisplay.style.color = 'red';
            timerDisplay.style.fontSize = '2.2em';
        }

        if (timeLeft <= 0) {
            endGame();
        }
        displayContent();
    }, 1000);
}

function highLight() {
    const typed = typingArea.value;
    let highText = '';

    for (let i = 0; i < currentText.length; i++) {
        if (i < typed.length) {
            if (currentText[i] === typed[i]) {
                highText += `<span class="correct">${currentText[i]}</span>`;
            } else {
                highText += `<span class="incorrect">${currentText[i]}</span>`;
            }
        } else {
            highText += currentText[i];
        }
    }
    textDisplay.innerHTML = highText;

    if (typed.length >= currentText.length && timeLeft > 0) {
        loadnewPara();
    }
}

function loadnewPara() {
    currentText = testTexts[Math.floor(Math.random() * testTexts.length)];
    textDisplay.innerHTML += `<br><br>${currentText}`;
    typingArea.value = "";
    startTime = Date.now();
}

function updatestatus() {
    const typed = typingArea.value;
    const minute = (Date.now() - startTime) / 1000 / 60;

    const words = typed.trim().split(/\s+/).filter(w => w.length > 0);
    wpm = (minute > 0) ? Math.round(words.length / minute) : 0;
    wpmDisplay.textContent = wpm;

    //================================================================//
    // ================ TASK 1 :: Bold WPM when > 100 =================
    //================================================================//
    if (wpm > 100) {
        wpmDisplay.style.fontWeight = 'bold';
    }

    // ACCURACY
    let correctChars = 0;
    for (let i = 0; i < typed.length; i++) {
        if (currentText[i] === typed[i]) correctChars++;
    }

    const accuracy = (typed.length > 0)
        ? Math.floor((correctChars / typed.length) * 100)
        : 0;

    accuracyDisplay.textContent = accuracy + '%';

    //================================================================//
    // ================ TASK 2 :: Perfect accuracy effect =================
    //================================================================//
    accuracyDisplay.style.color = (accuracy === 100 ? "green" : "black");
}

function typeControl() {

    if (startTime == null) startTime = Date.now();

    updatestatus();
    highLight();

    //================================================================//
    // ================ TASK 3 :: Keep Typing Warning =================
    //================================================================//
    if (pauseTimer) clearTimeout(pauseTimer);
    pauseTimer = setTimeout(() => {
        accuracyDisplay.textContent = "Keep typing!";
        accuracyDisplay.style.color = "blue";
    }, 3000);

    //================================================================//
    // ================ TASK 4 :: First Word Flash =================
    const typed = typingArea.value;
    if (!firstSpaceHappened && typed.includes(" ")) {
        firstSpaceHappened = true;
        wpmDisplay.style.fontWeight = "bold";
        setTimeout(() => {
            wpmDisplay.style.fontWeight = "normal";
        }, 300);
    }

    //================================================================//
    // ================ TASK 8 :: Fastest Start =================
    //================================================================//
    if (typed.length === 1) firstFiveStart = Date.now(); // start timer
    if (typed.length === 5 && firstFiveStart != null) {
        let timeTaken = Date.now() - firstFiveStart;
        sessionStorage.setItem('fastStart', timeTaken);
        if (fastStartDisplay) fastStartDisplay.textContent = `Fastest Start: ${timeTaken} ms`;
    }
}

startBtn.addEventListener('click', startGame);
typingArea.addEventListener('input', typeControl);

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    typingArea.value = "";
    typingArea.disabled = true;
    startTime = null;
    timeLeft = 60;
    wpm = 0;
    accuracyDisplay.textContent = "100%";
    wpmDisplay.textContent = "0";
    textDisplay.textContent = 'Click "Start Test" to begin typing!';
    startBtn.disabled = false;
    displayContent();
});
