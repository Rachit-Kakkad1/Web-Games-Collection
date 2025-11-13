const colorDisplay = document.querySelector('#colorDisplay');                   // Select the element showing the RGB color text
const messageDisplay = document.querySelector('#message');                      // Select the message area (Correct / Try Again)
const currentStreakDisplay = document.querySelector('#currentStreak');          // Shows current streak
const bestStreakDisplay = document.querySelector('#bestStreak');                // Shows best/highest streak

const colorBoxes = document.querySelectorAll('.color-box');                     // Select all color box divs
const newRoundBtn = document.querySelector('#newRoundBtn');                     // Button to start a new round
const easyBtn = document.querySelector('#easyBtn');                             // Button for easy mode (3 colors)
const hardBtn = document.querySelector('#hardBtn');                             // Button for hard mode (6 colors)
const resetStreakBtn = document.querySelector('#resetStreakBtn');               // Button to reset streak

let currentStreak = 0;                                                          // Track current correct streak
let bestStreak = 0;                                                             // Store best streak
let correctColor = '';                                                          // Store the correct color for the round
let colors = [];                                                                // Array to hold all generated colors
let num = 6;                                                                    // Default number of boxes = hard mode


// On web load

function webLoad() {                                                            // Function triggered when site loads
    onLoad();                                                                   // Load saved streaks
    setGame();                                                                  // Set up first game round
    displayContent();                                                           // Update streak displays on screen
}

function onLoad() {                                                             // Load high streak from localStorage
    const temp = localStorage.getItem('highBestStreak');                        // Get saved value
    bestStreak = temp ? parseInt(temp) : 0;                                     // If exists convert to number, else 0
}


// Update streak displays

function displayContent() {                                                     // Update streak UI
    currentStreakDisplay.textContent = currentStreak;                           // Show current streak
    bestStreakDisplay.textContent = bestStreak;                                 // Show best streak
}               


// Generate a single random color

function colorGenerate() {                                                       // Create random RGB value
    const a = Math.floor(Math.random() * 256);                                   // Red value 0–255
    const b = Math.floor(Math.random() * 256);                                   // Green value 0–255
    const c = Math.floor(Math.random() * 256);                                   // Blue value 0–255
    return `rgb(${a}, ${b}, ${c})`;                                              // Return RGB string
}


// Generate an array of colors

function generateColor(num) {                                                    // Generate multiple random colors
    const arr = [];                                                              // Create empty array
    for (let i = 0; i < num; i++) {                                              // Loop for required amount
        arr.push(colorGenerate());                                               // Push random color into array
    }
    return arr;                                                                  // Return generated colors
}


// Pick one color randomly from array //

function pickGenerator() {                                                       // Choose random color from array
    const randomIndex = Math.floor(Math.random() * colors.length);               // Get random index
    return colors[randomIndex];                                                  // Return that color
}


// Set up the game round

function setGame() {                                                             // Configure the game round
    colors = generateColor(num);                                                 // Generate fresh colors
    correctColor = pickGenerator();                                              // Pick correct target color
    colorDisplay.textContent = correctColor;                                     // Show the color (rgb values)
    colorDisplay.style.fontWeight = "normal";                                    // Reset bold effect
    messageDisplay.textContent = '';                                             // Clear previous message

    easyBtn.style.backgroundColor = "";                                          // Reset easy button color
    hardBtn.style.backgroundColor = "";                                          // Reset hard button color

    for (let i = 0; i < colorBoxes.length; i++) {                                // Loop through all color boxes
        if (colors[i]) {                                                         // If color exists for this box
            colorBoxes[i].style.display = 'block';                               // Show the box
            colorBoxes[i].style.backgroundColor = colors[i];                     // Apply color
            colorBoxes[i].style.border = "none";                                 // Reset border (from glow)
        } else {
            colorBoxes[i].style.display = 'none';                                // Hide extra boxes in easy mode
        }

        colorBoxes[i].onclick = function () {                                    // Add click event to each box
            const clickedColor = this.style.backgroundColor;                     // Get clicked color

            if (clickedColor === correctColor) {                                 // If correct guess


                // ============================================================ //
                //      TASK -- 1 :: Correct Color Glows (Yellow Border)        //
                // ============================================================ //

                this.style.border = "5px solid yellow";


                // ============================================================ //
                //     TASK -- 4 :: Show "First Win!" When Streak Becomes 1     //
                // ============================================================ //

                if (currentStreak === 0) {
                    messageDisplay.textContent = "First Win!";
                    messageDisplay.style.color = "gold";
                }

                currentStreak++;                                                 // Increase streak count


                // ============================================================ //
                //          TASK -- 2 :: Show "Streak!" At Streak ≥ 3           //
                // ============================================================ //

                if (currentStreak >= 3) {
                    messageDisplay.textContent = "Streak!";
                    messageDisplay.style.color = "green";
                }

                // ============================================================ //
                //     TASK -- 5 :: Header Text Bold On New Best Streak         //
                // ============================================================ //
                
                if (currentStreak > bestStreak) {
                    colorDisplay.style.fontWeight = "bold";
                }

                bestStreak = Math.max(bestStreak, currentStreak);               // Update best streak
                localStorage.setItem('highBestStreak', bestStreak);             // Save best streak
                changeColors(correctColor);                                     // Make all boxes same color
                displayContent();                                               // Update displays

            } else {                                                            // If wrong guess


                // ============================================================ //
                //          TASK -- 6 :: Wrong Box Shakes On Wrong Click        //
                // ============================================================ //

                this.classList.add("shake");
                setTimeout(() => {
                    this.classList.remove("shake");
                }, 400);

                messageDisplay.textContent = 'Try Again !!! ';                  // Show try again message
                messageDisplay.style.color = "red";                              // Red message
                this.style.backgroundColor = '#000';                             // Fade this box to black
                currentStreak = 0;                                               // Reset current streak
                displayContent();                                                // Update display
            }
        };
    }
}


// Change all boxes to one color on correct guess

function changeColors(color) {                                                     // Apply single color to all boxes
    for (let i = 0; i < colorBoxes.length; i++) {                                  // Loop all color boxes
        colorBoxes[i].style.backgroundColor = color;                               // Set background color
    }
}


// Button Actions

newRoundBtn.onclick = function () {                                                 // New round button click
    setGame();                                                                      // Reset game round
};

easyBtn.onclick = function () {                                                     // Easy mode clicked
    num = 3;                                                                        // Only 3 boxes

    // ============================================================ //
    //     TASK -- 3 :: Easy Button Turns Green When Active         //
    // ============================================================ //

    easyBtn.style.backgroundColor = "lightgreen";
    hardBtn.style.backgroundColor = "";

    setGame();                                                                      // Reset round
};

hardBtn.onclick = function () {                                                     // Hard mode clicked
    num = 6;                                                                        // 6 boxes
    hardBtn.style.backgroundColor = "lightgreen";                                   // Optional: match behavior
    easyBtn.style.backgroundColor = "";
    setGame();                                                                      // Reset round
};

resetStreakBtn.onclick = function () {                                              // Reset streak button click
    localStorage.removeItem('highBestStreak');                                      // Remove stored best streak
    bestStreak = 0;                                                                 // Reset best streak
    currentStreak = 0;                                                              // Reset current streak
    displayContent();                                                               // Update UI
};


// Initialize game

webLoad();                                                                          // Run everything when page loads
