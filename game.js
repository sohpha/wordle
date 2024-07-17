document.addEventListener('DOMContentLoaded', () => {
    let currentRow = 0;
    let currentCol = 0;

    let gamesPlayed = 0;
    let score = 0;

    let gameOver = false;

    //let topStreaks = [];
    //const numAttempts = 6 // also the number of rows
    //const numLetters = 5 // number of letters per row

    let guess = [] // stores the user's guess 

    document.getElementById('reset').addEventListener('mousedown', () => {
        resetGame();
    });
    document.getElementById('playAgainButton').addEventListener('mousedown', () => {
        playAgain();

    });

    document.addEventListener('keydown', (keyboardEvent) => {

        const key = keyboardEvent.key.toUpperCase();

        if (keyboardEvent.code === `Key${key}` || key === 'BACKSPACE' || key === 'ENTER') {

            updateGuess(key.toLowerCase());
        }

    })


    function updateGuess(key) {
        fetch(`game.php?key=${key}`, {
            method: 'GET',

        })
            .then(response => response.json())
            .then(data => {
                console.log('Game state updated:', data);

                currentCol = data.currentCol;
                currentRow = data.currentRow;

                cellColors = data.cellColors;
                keyColors = data.keyColors;

                gamesPlayed = data.gamesPlayed;
                score = data.score;

                gameOver = data.gameOver;

                word = data.word;
                maxLettersReached = data.maxLettersReached;

                // topStreaks = data.topStreaks;
                if (!maxLettersReached) {
                    updateUI(key, cellColors, keyColors);
                }

                // if game if over, update scoreboard and reveal word
                if (gameOver) {
                    updateScoreboard(gamesPlayed, score);
                    document.getElementById('answer').innerText = word.toUpperCase();
                    sessionStorage.setItem('word', word.toUpperCase())

                }


            })

    };

    function updateScoreboard(gamesPlayed, score) {
        lost = gamesPlayed - score
        document.getElementById('gamesPlayed').innerText = gamesPlayed;
        document.getElementById('score').innerText = score;
        document.getElementById('gamesLost').innerText = lost

        sessionStorage.setItem('gamesPlayed', gamesPlayed)
        sessionStorage.setItem('score', score)
        sessionStorage.setItem('gamesLost', lost)
    }

    function updateUI(key, cellColors, keyColors) {
        if (sessionStorage.getItem('key_colors') === null) {
            sessionStorage.setItem('key_colors', JSON.stringify({}))
        }
        if (sessionStorage.getItem('cell_letters') === null) {
            sessionStorage.setItem('cell_letters', JSON.stringify({}))
        }
        if (sessionStorage.getItem('cell_colors') === null) {
            sessionStorage.setItem('cell_colors', JSON.stringify({}))
        }

        if (key.toLowerCase() === 'backspace') {
            elem = document.getElementById(`r${currentRow}c${currentCol}`);
            elem.textContent = '';

            cell_letters = JSON.parse(sessionStorage.getItem('cell_letters'))
            cell_letters[`r${currentRow}c${currentCol}`] = ''; // add key
            sessionStorage.setItem('cell_letters', JSON.stringify(cell_letters)) // update
            console.log("CELL LETTERS: ", cell_letters);

        } else if (key === `${key}` && key !== 'enter') {
            elem = document.getElementById(`r${currentRow}c${currentCol - 1}`);
            elem.textContent = key.toUpperCase();

            cell_letters = JSON.parse(sessionStorage.getItem('cell_letters'))
            cell_letters[`r${currentRow}c${currentCol - 1}`] = key.toUpperCase(); // add key
            sessionStorage.setItem('cell_letters', JSON.stringify(cell_letters)) // update
            console.log("CELL LETTERS: ", cell_letters);

        } else {
            // color letter cells
            if (!(Array.isArray(cellColors) && cellColors.length == 0)) {
                for (i = 0; i < 5; i++) {
                    elem = document.getElementById(`r${currentRow - 1}c${i}`);
                    index = Array.isArray(cellColors) ? i : i.toString()
                    elem.style.backgroundColor = cellColors[index];

                    cell_colors = JSON.parse(sessionStorage.getItem('cell_colors'))
                    cell_colors[`r${currentRow - 1}c${i}`] = cellColors[index];
                    sessionStorage.setItem('cell_colors', JSON.stringify(cell_colors))
                    if (i == 4) {
                        console.log("CELL COLORS: ", cell_colors)
                    }

                }

            }

            // Color keyboard keys
            for (let key in keyColors) {

                let keyBackground = document.getElementById(`key${key}`);
                keyBackground.style.backgroundColor = keyColors[key];

                key_colors = JSON.parse(sessionStorage.getItem('key_colors'))
                key_colors[`key${key}`] = keyColors[key];
                sessionStorage.setItem('key_colors', JSON.stringify(key_colors))
                console.log("KEY COLORS: ", key_colors)
            }
        }

    }

    function resetGame() {
        fetch(`game.php?key=reset`, {
            method: 'GET',

        })
            .then(response => response.json())
            .then(data => {

                gamesPlayed = data.gamesPlayed;
                score = data.score;

                resetGrid();
                resetKeyboard();
                document.getElementById('answer').innerText = '';
                sessionStorage.setItem('word', '')

                updateScoreboard(gamesPlayed, score);

            })

    }

    function playAgain() {
        fetch(`game.php?key=playAgain`, {
            method: 'GET',

        })
            .then(response => response.json())
            .then(data => {
                cellColors = data.cellColors;
                keyColors = data.keyColors;
                resetGrid();
                resetKeyboard();
                sessionStorage.setItem('key_colors', JSON.stringify({}))
                sessionStorage.setItem('cell_letters', JSON.stringify({}))
                sessionStorage.setItem('cell_colors', JSON.stringify({}))

                document.getElementById('answer').innerText = '';
                sessionStorage.setItem('word', '')

            })
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

    function restoreDisplay() {
        document.getElementById('gamesPlayed').innerText = sessionStorage.getItem('gamesPlayed'); // if null make it 0
        document.getElementById('score').innerText = sessionStorage.getItem('score'); // if null make it 0
        document.getElementById('gamesLost').innerText = sessionStorage.getItem('gamesLost'); // if null make it 0
        // null check needed?
        document.getElementById('answer').innerText = sessionStorage.getItem('word')

        // if key_colors is not null and has keys: 
        key_colors = JSON.parse(sessionStorage.getItem('key_colors'))
        if(key_colors !== null && Object.keys(key_colors).length > 0) {
            console.log("restoring key colors...")
            for (let key in key_colors) {
                let keyBackground = document.getElementById(key);
                keyBackground.style.backgroundColor = key_colors[key];
                console.log("restored "+ keyBackground + "color to " + key_colors[key])
            }
        } 
    
        // if cell_letters is not null and has keys:
        cell_letters = JSON.parse(sessionStorage.getItem('cell_letters'))
        if(cell_letters !== null && Object.keys(cell_letters).length > 0) {
            for (let cell in cell_letters) {
                let elem = document.getElementById(cell);
                elem.textContent = cell_letters[cell]
                console.log("restored " + cell + " letter to " + cell_letters[cell])
            }
        }

        // if cell_colors is not null and has keys
        cell_colors = JSON.parse(sessionStorage.getItem('cell_colors'))
        if(cell_colors !== null && Object.keys(cell_colors).length > 0) {
            for (let cell in cell_colors) {
                let elem = document.getElementById(cell)
                elem.style.backgroundColor = cell_colors[cell]
                console.log("restored " + cell + " color to " + cell_colors[cell])
            }
        }

    }
    window.onload = restoreDisplay()

});