let currentRow = 0;
let currentCol = 0;
let score = 0;
const numAttempts = 6 // also the number of rows
const numLetters = 5 // number of letters per row

const word = 'react'; // test word
const guessList = ['trace', 'crate', 'react']; // test word list

let gameOver = false;
let guess = []

document.addEventListener("DOMContentLoaded", () => {

    document.addEventListener("keydown", (keyboardEvent) => {

        const key = keyboardEvent.key.toUpperCase();
        if (keyboardEvent.code === `Key${key}` && currentCol < numLetters) {
            elem = document.getElementById(`r${currentRow}c${currentCol}`)
            elem.textContent = key.toUpperCase()
            currentCol++
            guess.push(key.toLowerCase())
        } else if (key === 'BACKSPACE' && currentCol > 0) {
            currentCol--
            elem = document.getElementById(`r${currentRow}c${currentCol}`)
            elem.textContent = ''
            guess.pop();
        } else if (key === 'ENTER' && currentCol == numLetters) {
            // process input


            // if correct, update score and have a new round

           /* score++;
            resetGrid() */
            console.log(guess);
            guess = []



            // if wrong, go to next attempt or exit game
            currentRow++
            currentCol = 0;
            if (currentRow == numAttempts) {
                gameOver = true
                score = 0
                guess =[]
                resetGrid()
                // play again
                // stop event listener
                // but for now it'll just restart
            }
        }

    })


});

// clear grid for new attempt or round
function resetGrid() {
    currentRow = 0;
    currentCol = 0;
    var list = document.getElementsByClassName('row-input');
    var n;
    for (n = 0; n < list.length; ++n) {
        list[n].textContent = '';
    }

}


function handleKeyClick(key) {
    if (gameOver) return;

    let color = checkIfCorrect(key);
    shadeKeyBoard(key, color);

    console.log(`Key clicked: ${key}`);
    console.log(`Color: ${color}`)

}

function checkIfCorrect(letter) {
    let wordIndex = word.indexOf(letter);

    console.log(`row: ${row}`)
    console.log(`wordIndex: ${wordIndex}`)

    if (wordIndex == -1) {
        return '#787c7e';
    }
    else if (wordIndex === row) {
        return '#6aaa64';
    }
    else {
        return '#c9b458'
    }


}

// update the key colors
function shadeKeyBoard(letter, color) {
    document.querySelectorAll('.keyboard-button').forEach(button => {
        if (button.textContent === letter) {
            button.style.backgroundColor = color;
        }
    });


    row += 1;
    col + 1;
}


 // Listen for key press 
    /* var keys = document.querySelectorAll('button[data-key]');
 
     keys.forEach(key => {
         key.addEventListener('click', () => handleKeyClick(key.dataset.key));
     }); */