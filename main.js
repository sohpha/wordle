let currentRow = 0;
let currentCol = 0;
let score = 0;
const numAttempts = 6 // also the number of rows
const numLetters = 5 // number of letters per row

const word = 'react'; // test word
const wordIndexMap = getLetterIndexes(word)
const guessList = ['trace', 'crate', 'react']; // test word list

const green = '#6aaa64'
const yellow = '#c9b458'
const gray = '#787c7e'

let gameOver = false;
let guess = [] // stores the user's guess 

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
            let correctGuess = processAttempt(guess)
            if (correctGuess) {
                score++;
                //  resetGrid()
                // guess new word

            } else { // if wrong, go to next attempt or exit game
                currentRow++
                currentCol = 0;
                if (currentRow == numAttempts) {
                    gameOver = true
                    score = 0
                    resetGrid()
                    // play again ? 
                    // stop event listener
                }
            }

            guess = []

        }

    })


});

// input is array, output is boolean
// return true if user guessed word correctly, false otherwise
function processAttempt(guess) {
    guessString = guess.join("") // convert to string
    if (guessString === word) {
        const cells = document.querySelectorAll(`[id^="r${currentRow}"]`);
        cells.forEach(cell => {
            cell.style.backgroundColor = green;
        });
        score++
        return true
    }
    letterCountMap = countLetterOccurrences(word)

    // find the absent letters and letters in correct position
    for (let i = 0; i < guessString.length; i++) {
        let letter = guessString[i]
        if (!wordIndexMap[letter]) { // letter not present
            elem = document.getElementById(`r${currentRow}c${i}`)
            elem.style.backgroundColor = gray

            // also gray out keys on keyboard

        } else if (wordIndexMap[letter].includes(i)) {
            elem = document.getElementById(`r${currentRow}c${i}`)
            elem.style.backgroundColor = green
            letterCountMap[letter]--
            console.log(letterCountMap[letter])
            // do something to keyboard
        }
    }

    // deal with the yellow letters
    for (let i = 0; i < guessString.length; i++) {
        let letter = guessString[i]
        if (!wordIndexMap[letter] || wordIndexMap[letter].includes(i)) {
            continue // already handled 
        } else if (letterCountMap[letter] > 0) {
            elem = document.getElementById(`r${currentRow}c${i}`)
            letterCountMap[letter]--
            elem.style.backgroundColor = yellow
            // do something to keyboard

        } else {
            elem = document.getElementById(`r${currentRow}c${i}`)
            elem.style.backgroundColor = gray

            // don't touch keyboard
        }
    }

    return false


}

// helper functions 
function countLetterOccurrences(word) {
    let letterCounts = {};

    for (let i = 0; i < word.length; i++) {
        let letter = word[i];

        if (letterCounts[letter]) {
            letterCounts[letter]++;
        } else {
            letterCounts[letter] = 1;
        }
    }

    return letterCounts;

}

function getLetterIndexes(word) {
    const letterIndexMap = {};

    for (let i = 0; i < word.length; i++) {
        const letter = word[i];

        if (letterIndexMap[letter]) {
            letterIndexMap[letter].push(i);
        } else {
            letterIndexMap[letter] = [i];
        }
    }

    return letterIndexMap;
}


// clear grid for new attempt or round
function resetGrid() {
    currentRow = 0;
    currentCol = 0;
    var list = document.getElementsByClassName('row-input');
    var n;
    for (n = 0; n < list.length; ++n) {
        list[n].textContent = '';
        list[n].style.backgroundColor = 'white'
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