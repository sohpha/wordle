let currentRow = 0;
let currentCol = 0;
let score = 0;
let gamesPlayed = 0;

const numAttempts = 6 // also the number of rows
const numLetters = 5 // number of letters per row

const green = '#6aaa64'
const yellow = '#c9b458'
const gray = '#787c7e'

let gameOver = false;
let guess = [] // stores the user's guess 

document.addEventListener('DOMContentLoaded', () => {

    // word for first attempt
    word = WORDS[Math.floor(Math.random() * WORDS.length)].toLowerCase();
    wordIndexMap = getLetterIndexes(word)
    console.log(`word: ${word}`)

    document.addEventListener('keydown', (keyboardEvent) => {

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
            guess.pop()

        } else if (key === 'ENTER' && currentCol < numLetters && !gameOver) {
            alert('Word is too short!')

        } else if (key === 'ENTER' && currentCol == numLetters && !gameOver) {
            let correctGuess = processAttempt(guess, word, wordIndexMap)
            if (correctGuess) {
                score++
                gameOver = true
                document.getElementById('playAgainButton').addEventListener('mousedown', playAgain);

            } else { // if wrong, go to next attempt or exit game
                currentRow++
                currentCol = 0
                if (currentRow == numAttempts) {
                    // reveal the word
                    document.getElementById('answer').innerText = word.toUpperCase();
                    gameOver = true
                    document.getElementById('playAgainButton').addEventListener('mousedown', playAgain);
                }
            }

            guess = []

        }

    })


});



/**
 * Determines whether the player correclty guessed the word
 * @param {array} guess the players's attempt
 * @param {string} word the word to guess
 * @param {object} wordIndexMap map object for the word to guess containing the indexes of each letter occurence
 * @returns {boolean} indicates if the player guessed the word
 */
function processAttempt(guess, word, wordIndexMap) {

    // convert to string
    guessString = guess.join('')

    // Handle correct guess
    if (guessString === word) {

        // color the grid row for the attempt green
        const cells = document.querySelectorAll(`[id^='r${currentRow}']`);
        cells.forEach(cell => {
            cell.style.backgroundColor = green;

        });

        // color the letters on the keyboard green
        for (let i = 0; i < guessString.length; i++) {
            let letter = guessString[i]

            let key = letter.toUpperCase()
            keyColor = document.getElementById(`key${key}`)

            keyColor.style.backgroundColor = green

        }
        return true // player guessed the word
    }

    // Get occurrence of each letter in the word to guess
    letterCountMap = countLetterOccurrences(word)

    // Find the absent letters and letters in correct position
    for (let i = 0; i < guessString.length; i++) {
        let letter = guessString[i]
        let key = letter.toUpperCase()
        keyColor = document.getElementById(`key${key}`)

        if (!wordIndexMap[letter]) { // letter not present

            elem = document.getElementById(`r${currentRow}c${i}`)
            // color gray
            elem.style.backgroundColor = gray
            keyColor.style.backgroundColor = gray

        } else if (wordIndexMap[letter].includes(i)) { // letter present

            elem = document.getElementById(`r${currentRow}c${i}`)
            letterCountMap[letter]-- // decrement occurrence count of letter
            // color green
            elem.style.backgroundColor = green
            keyColor.style.backgroundColor = green
        }
    }

    // Handle the yellow letters
    for (let i = 0; i < guessString.length; i++) {

        let letter = guessString[i]
        let key = letter.toUpperCase()
        keyColor = document.getElementById(`key${key}`)

        if (!wordIndexMap[letter] || wordIndexMap[letter].includes(i)) { // letter not present or letter in correct position

            continue // already handled in previous loop

        } else if (letterCountMap[letter] > 0) { //if letter still has occurrences in the word

            elem = document.getElementById(`r${currentRow}c${i}`)
            letterCountMap[letter]-- // decrement occurrence count of letter
            // color yellow
            elem.style.backgroundColor = yellow
            keyColor.style.backgroundColor = yellow

        } else { // no more occurrences of letter in the word 

            elem = document.getElementById(`r${currentRow}c${i}`)
            elem.style.backgroundColor = gray
        }
    }

    return false // player did not guess the word 

}

// Helper Functions

/**
 * Randomly picks a new word form word list and updates global variable
 */
function pickNewWord() {
    // choose new word
    word = WORDS[Math.floor(Math.random() * WORDS.length)].toLowerCase();
    wordIndexMap = getLetterIndexes(word)
    console.log(`word: ${word}`)
}

/**
 * Sets up a new round
 */
function playAgain() {
    gameOver = false
    resetGrid()
    resetKeyboard();
    document.getElementById('answer').innerText = '';
    gamesPlayed++;
    updateScoreboard();
    pickNewWord();
    guess = [];

}

function updateScoreboard() {
    document.getElementById('gamesPlayed').innerText = gamesPlayed;
    document.getElementById('score').innerText = score;
    document.getElementById('gamesLost').innerText = gamesPlayed - score;

}

/**
 * Clears the guessing grid
 */
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

/**
 * Clears the keyboard by resetting all green, gray or yellow keys to 
 * their initial color
 */
function resetKeyboard() {
    var list = document.getElementsByClassName('keyboard-button');
    var n;
    for (n = 0; n < list.length; ++n) {
        list[n].style.backgroundColor = 'rgb(58, 58, 60)';
    }

}


/**
 * Counts the number of times each letter in the word occurs. Returns
 * a map object where the key is the letter and the value is its number of occurrences
 * @param {string} word 
 * @returns {object} 
 */
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

/**
 * Returns a map object where the key is a letter in the word
 * and the value is an array of indexes where the letter occurs
 * @param {string} word 
 * @returns {object}
 */
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

