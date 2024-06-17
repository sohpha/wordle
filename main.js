
let currentRow = 0;
let currentCol = 0;
let score = 0;
let gamesPlayed = 0;

const numAttempts = 6 // also the number of rows
const numLetters = 5 // number of letters per row

const guessList = ["awake", "blush", "focal", "evade", "naval", "serve", "heath", "dwarf", "model", "karma", "stink", "grade", "quiet", "bench", "abate", "feign", "major", "death", "fresh", "crust", "stool", "colon", "abase", "marry", "react", "batty", "pride", "floss", "helix", "croak", "staff", "paper", "unfed", "whelp", "trawl", "outdo", "adobe", "crazy", "sower", "repay", "digit", "crate", "cluck", "spike", "mimic", "pound", "maxim", "linen", "unmet", "flesh", "booby", "forth", "first", "stand", "belly", "ivory", "seedy", "print", "yearn", "drain", "bribe", "stout", "panel", "crass", "flume", "offal", "agree", "error", "swirl", "argue", "bleed", "delta", "flick", "totem", "wooer", "front", "shrub", "parry", "biome", "lapel", "start", "greet", "goner", "golem", "lusty", "loopy", "round", "audit", "lying", "gamma", "labor", "islet", "civic", "forge", "corny", "moult", "basic", "salad", "agate", "spicy", "spray", "essay", "fjord", "spend", "kebab", "guild", "aback", "motor", "alone", "hatch", "hyper", "thumb", "dowry", "ought", "belch", "dutch", "pilot", "tweed", "comet", "jaunt", "enema", "steed", "abyss", "growl", "fling", "dozen", "boozy", "erode", "world", "gouge", "click", "briar", "great", "altar", "pulpy", "blurt", "coast", "duchy", "groin", "fixer", "group", "rogue", "badly", "smart", "pithy", "gaudy", "chill", "heron", "vodka", "finer", "surer", "radio", "rouge", "perch", "retch", "wrote", "clock", "tilde", "store", "prove", "bring", "solve", "cheat", "grime", "exult", "usher", "epoch", "triad", "break", "rhino", "viral", "conic", "masse", "sonic", "vital", "trace", "using", "peach", "champ", "baton", "brake", "pluck", "craze", "gripe", "weary", "picky", "acute", "ferry", "aside", "tapir", "troll", "unify", "rebus", "boost", "truss", "siege", "tiger", "banal", "slump", "crank", "gorge", "query", "drink", "favor", "abbey", "tangy", "panic", "solar", "shire", "proxy", "point", "robot", "prick", "wince", "crimp", "knoll", "sugar", "whack", "mount", "perky", "could", "wrung", "light", "those", "moist", "shard", "pleat", "aloft", "skill", "elder", "frame", "humor", "pause", "ulcer", "ultra", "robin", "cynic", "aroma", "caulk", "shake", "dodge", "swill", "tacit", "other", "thorn", "trove", "bloke", "vivid", "spill", "chant", "choke", "rupee", "nasty", "mourn", "ahead", "brine", "cloth", "hoard", "sweet", "month", "lapse", "watch", "today", "focus", "smelt", "tease", "cater", "movie", "saute", "allow", "renew", "their", "slosh", "purge", "chest", "depot", "epoxy", "nymph", "found", "shall", "harry", "stove", "lowly", "snout", "trope", "fewer", "shawl", "natal", "comma", "foray", "scare", "stair", "black", "squad", "royal", "chunk", "mince", "shame", "cheek", "ample", "flair", "foyer", "cargo", "oxide", "plant", "olive", "inert", "askew", "heist", "shown", "zesty", "hasty", "trash", "fella", "larva", "forgo", "story", "hairy", "train", "homer", "badge", "midst", "canny", "fetus", "butch", "farce", "slung", "tipsy", "metal", "yield", "delve", "being", "scour", "glass", "gamer", "scrap", "money", "hinge", "album", "vouch", "asset", "tiara", "crept", "bayou", "atoll", "manor", "creak", "showy", "phase", "froth", "depth", "gloom", "flood", "trait", "girth", "piety", "payer", "goose", "float", "donor", "atone", "primo", "apron", "blown", "cacao", "loser", "input", "gloat", "awful", "brink", "smite", "beady", "rusty", "retro", "droll", "gawky", "hutch", "pinto", "gaily", "egret", "lilac", "sever", "field", "fluff", "hydro", "flack", "agape", "voice", "stead", "stalk", "berth", "madam", "night", "bland", "liver", "wedge", "augur", "roomy", "wacky", "flock", "angry", "bobby", "trite", "aphid", "tryst", "midge", "power", "elope", "cinch", "motto", "stomp", "upset", "bluff", "cramp", "quart", "coyly", "youth", "rhyme", "buggy", "alien", "smear", "unfit", "patty", "cling", "glean", "label", "hunky", "khaki", "poker", "gruel", "twice", "twang", "shrug", "treat", "unlit", "waste", "merit", "woven", "octal", "needy", "clown", "widow", "irony", "ruder", "gauze", "chief", "onset", "prize", "fungi", "charm", "gully", "inter", "whoop", "taunt", "leery", "class", "theme", "lofty", "tibia", "booze", "alpha", "thyme", "eclat", "doubt", "parer", "chute", "stick", "trice", "alike", "sooth", "recap", "saint", "liege", "glory", "grate", "admit", "brisk", "soggy", "usurp", "scald", "scorn", "leave", "twine", "sting", "bough", "marsh", "sloth", "dandy", "vigor", "howdy", "enjoy", "valid", "ionic", "equal", "unset", "floor", "catch", "spade", "stein", "exist", "quirk", "denim", "grove", "spiel", "mummy", "fault", "foggy", "flout", "carry", "sneak", "libel", "waltz", "aptly", "piney", "inept", "aloud", "photo", "dream", "stale", "vomit", "ombre", "fanny", "unite", "snarl", "baker", "there", "glyph", "pooch", "hippy", "spell", "folly", "louse", "gulch", "vault", "godly", "threw", "fleet", "grave"];

var word = guessList[Math.floor(Math.random()*guessList.length)].toLowerCase();
console.log(`word: ${word}`)

const wordIndexMap = getLetterIndexes(word)


const green = '#6aaa64'
const yellow = '#c9b458'
const gray = '#787c7e'

let gameOver = false;
let guess = [] // stores the user's guess 

document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('keydown', (keyboardEvent) => {

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
        } else if (key === 'ENTER' && currentCol == numLetters) {
            let correctGuess = processAttempt(guess)
            if (correctGuess) {
                // score++;
                //  resetGrid()
                 
                // guess new word

                document.getElementById('playAgainButton').addEventListener('mousedown', playAgain);

            } else { // if wrong, go to next attempt or exit game
                currentRow++
                currentCol = 0;
                if (currentRow == numAttempts) {
                    gameOver = true
                    // score = 0

                    // resetGrid()
                
                    


                    // play again ? 
                    // stop event listener

                     // reveal the word
                    document.getElementById('answer').innerText = word.toUpperCase();

                    // play again
                    document.getElementById('playAgainButton').addEventListener('mousedown', playAgain);
                    
                }
            }

            guess = []

        }
        else if (key === 'ENTER' && currentCol < numLetters) {
            alert('Too short!');

        }

    })


});

// input is array, output is boolean
// return true if user guessed word correctly, false otherwise
function processAttempt(guess) {

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
        score++
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

            // also gray out keys on keyboard
            keyColor.style.backgroundColor = gray

          



        } else if (wordIndexMap[letter].includes(i)) {
            elem = document.getElementById(`r${currentRow}c${i}`)
            elem.style.backgroundColor = green
            letterCountMap[letter]--
            console.log(letterCountMap[letter])
            // do something to keyboard
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
            // do something to keyboard
            keyColor.style.backgroundColor = yellow

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


function playAgain() {
    currentRow = 0;
    currentCol = 0;
    var list = document.getElementsByClassName('row-input');
    var n;
    for (n = 0; n < list.length; ++n) {
        list[n].textContent = '';
        list[n].style.backgroundColor = 'white'
    }

    // reset keyboard & answer
    resetKeyboard() ;
    document.getElementById('answer').innerText = '';

    gamesPlayed ++;
    updateScordboard();

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

function updateScordboard(){
    document.getElementById('gamesPlayed').innerText = gamesPlayed;
    document.getElementById('score').innerText = score;
    document.getElementById('gamesLost').innerText = gamesPlayed-score;

}


// clear keyboard 
function resetKeyboard() {
    var list = document.getElementsByClassName('keyboard-button');
    var n;
    for (n = 0; n < list.length; ++n) {
        list[n].style.backgroundColor = 'rgb(58, 58, 60)';
    }

}


// function handleKeyClick(key) {
//     if (gameOver) return;

//     let color = checkIfCorrect(key);
//     shadeKeyBoard(key, color);

//     console.log(`Key clicked: ${key}`);
//     console.log(`Color: ${color}`)

// }

// function checkIfCorrect(letter) {
//     let wordIndex = word.indexOf(letter);

//     console.log(`row: ${row}`)
//     console.log(`wordIndex: ${wordIndex}`)

//     if (wordIndex == -1) {
//         return '#787c7e';
//     }
//     else if (wordIndex === row) {
//         return '#6aaa64';
//     }
//     else {
//         return '#c9b458'
//     }


// }

// // update the key colors
// function shadeKeyBoard(letter, color) {
//     document.querySelectorAll('.keyboard-button').forEach(button => {
//         if (button.textContent === letter) {
//             button.style.backgroundColor = color;
//         }
//     });


//     // row += 1;
//     // col + 1;
// }


// // Listen for key press 
// /* var keys = document.querySelectorAll('button[data-key]');
 
//  keys.forEach(key => {
//      key.addEventListener('click', () => handleKeyClick(key.dataset.key));
//  }); */