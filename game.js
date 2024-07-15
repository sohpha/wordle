document.addEventListener('DOMContentLoaded', () => {
    let currentRow = 0;
    let currentCol = 0;

    let gamesPlayed = 0;
    let score = 0;

    let gameOver = false;

    let topStreaks = [];


    const numAttempts = 6 // also the number of rows
    const numLetters = 5 // number of letters per row

    let guess = [] // stores the user's guess 

    // document.getElementById('leaderboard').addEventListener('mousedown', () => {
    //     updateLeaderboard();

    // });
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

                // topStreaks = data.topStreaks;

                updateUI(key, cellColors, keyColors);

                // if game if over, update scoreboard and reveal word
                if (gameOver) {
                    updateScoreboard(gamesPlayed, score);
                    document.getElementById('answer').innerText = word.toUpperCase();

                }


            })

    };




    function updateScoreboard(gamesPlayed, score) {
        document.getElementById('gamesPlayed').innerText = gamesPlayed;
        document.getElementById('score').innerText = score;
        document.getElementById('gamesLost').innerText = gamesPlayed - score;
    }

    function updateUI(key, cellColors, keyColors) {
        if (key.toLowerCase() === 'backspace') {
            elem = document.getElementById(`r${currentRow}c${currentCol}`); // HERE
            elem.textContent = '';
        } else if (key === `${key}` && key !== 'enter') {
            elem = document.getElementById(`r${currentRow}c${currentCol - 1}`); 
            elem.textContent = key.toUpperCase();
        } else {
            // color letter cells
            if (!(Array.isArray(cellColors) && cellColors.length == 0)) {
                for (i = 0; i < 5; i++) {
                    elem = document.getElementById(`r${currentRow - 1}c${i}`);
                    index = Array.isArray(cellColors) ? i : i.toString()
                    elem.style.backgroundColor = cellColors[index]; 
                }
            }

            // Color keyboard keys
            for (let key in keyColors) {

                let keyBackground = document.getElementById(`key${key}`);
                keyBackground.style.backgroundColor = keyColors[key];

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
                document.getElementById('answer').innerText = '';


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


});



