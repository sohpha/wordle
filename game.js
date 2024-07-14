document.addEventListener('DOMContentLoaded', () => {
    let currentRow = 0;
    let currentCol = 0;

    const numAttempts = 6 // also the number of rows
    const numLetters = 5 // number of letters per row

    let guess = [] // stores the user's guess 
    document.getElementById('reset').addEventListener('click', () => {
        console.log("reset button clicked");
        resetGame();
    });

    document.addEventListener('keydown', (keyboardEvent) => {

        const key = keyboardEvent.key.toUpperCase();

        if (keyboardEvent.code === `Key${key}` || key === 'BACKSPACE' || key === 'ENTER') {
            console.log("Sending key to server:", key);

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

                console.log('CurrentCol:', currentCol);
                console.log('CurrentRow:', currentRow);


                updateUI(key);



            })

    };


    function updateUI(key) {
        if (key.toLowerCase() === 'backspace') {
            elem = document.getElementById(`r${currentRow}c${currentCol + 1}`);
            elem.textContent = '';
        } else if (key === `${key}` && key !== 'enter') {
            console.log("HOHO key: ", key);
            if (currentCol === numLetters) {
                currentCol = numLetters - 1;
            }
            elem = document.getElementById(`r${currentRow}c${currentCol}`);
            elem.textContent = key.toUpperCase();
        }
    }

    function resetGame() {
        fetch(`game.php?key=reset`, {
            method: 'GET',

        })
            .then(response => response.json())
            .then(data => {
                resetGrid();
                resetKeyboard();


            })
    }







});
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


