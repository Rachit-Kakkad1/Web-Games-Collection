// ----------------------------------------- //
//            MOST NEEDED ACCESS            //
// ---------------------------------------- //

var currentScore = document.querySelector('#currentScore');
var highScore = document.querySelector('#highScore');
var timer = document.querySelector('#timer');
var clickButton = document.querySelector('#clickButton');
var startButton = document.querySelector('#startButton');
var statusMessage = document.querySelector('#statusMessage');

// ----------------------------------------- //
//             EXTRA VARIABLES              //
// ---------------------------------------- //

var current = 0;
var high = 0;
var timer1 = 10;
var flag = false;
var timeId = null;

// ----------------------------------------- //
//                 METHODS                  //
// ---------------------------------------- //

// 1. To load(get item) the data of the user when we reload the browser it should automatically fetch the data from the local storage:  
function loadData() {
    var temp = localStorage.getItem('highScore');
    if (temp != null) {
        high = parseInt(temp); // converting string into number for proper comparison
    } else {
        high = 0;
    }
};

// 2. To check the content and actually change the content of the score and timer together 

function displayContent() {
    currentScore.textContent = current;  // shows live score on screen

    highScore.textContent = high;        // shows the best score stored

    timer.textContent = timer1;          // updates the timer countdown


    // ============================================================ //
    //        TASK -- 1 :: Click Counter Turns Red When > 20       //
    // =========================================================== //


    if (current > 20) {
        currentScore.style.color = "red"
    }

};

// 3. To load both display content and previous high score together on website load

function onWebsite() {

    loadData();       // fetches previous data

    displayContent(); // shows fetched values on screen
};

onWebsite();

// 4. Function to start the game when user clicks "Start Game" button

function startGame() {

    // to prevent multiple timers if user presses start many times

    if (flag) return;

    // resetting values before each new game
    current = 0;

    timer1 = 10;

    displayContent();

    clickButton.style.transform = "scale(1)";   // reset button size
    clickButton.scaleValue = 1;                 // reset stored scale


    // enabling click button so user can play
    clickButton.disabled = false;

    // flag true to show game is running
    flag = true;

    statusMsg("Your game has started !!");

    // ============================================================ //
    //         TASK -- 2 :: Show "Click Me!" For 1 Second           //
    // ============================================================ //

    statusMsg("Click Me!");
    setTimeout(() => {
        statusMsg("");
    }, 1000);

    // main timer logic which decreases the time every 1 sec

    timeId = setInterval(function () {

        timer1--;                // decreasing time

        timer.textContent = timer1; // showing updated time

        // when timer reaches zero, end the game automatically

        if (timer1 <= 0) {
            endGame();
        }

    }, 1000);

};


// 5. Function which runs whenever user clicks the main button

function userclick() {

    if (flag) {                 // check if game is running

        current++;              // increase score count by 1
        displayContent();       // update on screen


        // ============================================================ //
        //      TASK -- 3 :: Button Grows 10% On Every Click            //
        // ============================================================ //

        let currentScale = clickButton.scaleValue || 1;   // default scale = 1
        currentScale = currentScale * 1.1;                // grow 10%

        if (currentScale > 2) currentScale = 2;           // max limit = 2

        clickButton.style.transform = `scale(${currentScale})`;  // apply scale
        clickButton.scaleValue = currentScale;                   // store value

    }
};


// 6. This function is used to show the status message at bottom

function statusMsg(msg) {

    statusMessage.textContent = msg; // changes the content dynamically
};

// 7. Function which ends the game when timer is 0 sec or game is stopped manually

function endGame() {

    clearInterval(timeId);       // stops the running timer

    flag = false;                // marks game as over

    clickButton.disabled = true; // disables click button after time up


    // condition to check and update new high score if current > previous
    if (current > high) {

        high = current; // stores new high value in variable

        localStorage.setItem('highScore', high); // also saves it in browser local storage

        highScore.textContent = current; // updates display too

        statusMsg("New High Score! You crushed it!");


        // ============================================================ //
        //        TASK -- 6 :: Yellow Flash on New High Score           //
        // ============================================================ //

        document.body.style.background = "gold";
        setTimeout(() => {
            document.body.style.background = "";
        }, 1000);

    }

    else {

        // shows your score if not higher than previous one
        
        statusMsg(`Time's up! Your current score is ${current}`);

    }


    // ============================================================ //
    //          TASK -- 4 :: Show Clicks Per Second (CPS)           //
    // ============================================================ //

    let cps = (current / 10).toFixed(2);
    statusMessage.innerHTML += `<br>CPS: ${cps}`;

    

    // ============================================================ //
    //     TASK -- 5 :: Start Button Says "Play Again" After Game   //
    // ============================================================ //

    startButton.innerText = "Play Again";


    displayContent(); // updates all the content finally
};



// 8. Function to reset the high score manually whenever user clicks reset button

document.querySelector('#resetButton').addEventListener('click', function () {

    localStorage.removeItem('highScore'); // removes high score from local storage

    high = 0; // resets the variable

    displayContent(); // updates the display

    statusMsg("High Score has been reset successfully!");

});

// 9. Event listeners which start the game or increase score

startButton.addEventListener('click', startGame);  // starts timer + enables clicking

clickButton.addEventListener('click', userclick);  // counts clicks during the game


// 10. This new function resets the entire game (score, timer, high score, everything)

document.querySelector('#resetAllButton').addEventListener('click', function () {

    clearInterval(timeId);     // stop any running timer

    localStorage.removeItem('highScore'); // remove stored high score

    current = 0;               // reset current score

    high = 0;                  // reset high score

    timer1 = 10;               // reset timer

    flag = false;              // make sure game is stopped

    clickButton.disabled = true; // disable the click button till we restart the game 

    displayContent();          // refresh 

    statusMsg("Whole game has been reset successfully! Now You may Succesfully Proceeds Towards a New Game ..");
});
