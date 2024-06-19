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
    word = WORDS[Math.floor(Math.random()*WORDS.length)].toLowerCase();
    wordIndexMap = getLetterIndexes(word)

    document.addEventListener('keydown', (keyboardEvent) => {
        console.log(`word: ${word}`)


        guessString = guess.join('') // convert to string
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
        } else if (key === 'ENTER' && currentCol < numLetters && !gameOver) {
            alert('Word is too short!');
        } else if (key === 'ENTER' && currentCol == numLetters && !gameOver) {
            let correctGuess = processAttempt(guess, word, wordIndexMap)
            if (correctGuess) {
                score++;
                gameOver = true
                document.getElementById('playAgainButton').addEventListener('mousedown', playAgain);
            } else { // if wrong, go to next attempt or exit game
                currentRow++
                currentCol = 0;
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

function pickNewWord() {
    // choose new word
    word = WORDS[Math.floor(Math.random()*WORDS.length)].toLowerCase();
    wordIndexMap = getLetterIndexes(word)

}

function playAgain() {
    gameOver = false
    resetGrid()
    resetKeyboard() ;
    document.getElementById('answer').innerText = '';
    gamesPlayed++;
    updateScordboard();
    pickNewWord();
    guess = [];

}

function updateScordboard(){
    document.getElementById('gamesPlayed').innerText = gamesPlayed;
    document.getElementById('score').innerText = score;
    document.getElementById('gamesLost').innerText = gamesPlayed-score;

}

// input is array, output is boolean
// return true if user guessed word correctly, false otherwise
function processAttempt(guess, word, wordIndexMap) {

    guessString = guess.join('') // convert to string
    if (guessString === word) {
        const cells = document.querySelectorAll(`[id^='r${currentRow}']`);
        cells.forEach(cell => {
            cell.style.backgroundColor = green;
            
        });

        // coloring green 
        for (let i = 0; i < guessString.length; i++) {
            let letter = guessString[i]
            
            let key = letter.toUpperCase()
            keyColor = document.getElementById(`key${key}`)
        
            keyColor.style.backgroundColor = green
        
        }
        return true
    }

    letterCountMap = countLetterOccurrences(word)

    // find the absent letters and letters in correct position
    for (let i = 0; i < guessString.length; i++) {
        let letter = guessString[i]
        let key = letter.toUpperCase()
        keyColor = document.getElementById(`key${key}`)

        if (!wordIndexMap[letter]) { // letter not present
            elem = document.getElementById(`r${currentRow}c${i}`)

            elem.style.backgroundColor = gray
            keyColor.style.backgroundColor = gray

        } else if (wordIndexMap[letter].includes(i)) {
            elem = document.getElementById(`r${currentRow}c${i}`)
            elem.style.backgroundColor = green
            letterCountMap[letter]--

            keyColor.style.backgroundColor = green
        }
    }

    // deal with the yellow letters
    for (let i = 0; i < guessString.length; i++) {
        let letter = guessString[i]
        let key = letter.toUpperCase()
        keyColor = document.getElementById(`key${key}`)

        if (!wordIndexMap[letter] || wordIndexMap[letter].includes(i)) {
            continue // already handled 
        } else if (letterCountMap[letter] > 0) {
            elem = document.getElementById(`r${currentRow}c${i}`)
            letterCountMap[letter]--
            elem.style.backgroundColor = yellow
            keyColor.style.backgroundColor = yellow

        } else {
            elem = document.getElementById(`r${currentRow}c${i}`)
            elem.style.backgroundColor = gray
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

// clear keyboard 
function resetKeyboard() {
    var list = document.getElementsByClassName('keyboard-button');
    var n;
    for (n = 0; n < list.length; ++n) {
        list[n].style.backgroundColor = 'rgb(58, 58, 60)';
    }

}
