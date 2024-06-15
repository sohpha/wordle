let row = 0;
let col = 0;
const width = 5; // 5 letters/word
const height = 6; // 6 guesses allowed

const word = 'react'; // test word
const guessList = ['trace', 'crate', 'react']; // test word list

const guess = 'trace';

let gameOver = false; 

document.addEventListener("DOMContentLoaded", () => {



    // Listen for key press 
    var keys = document.querySelectorAll('button[data-key]');

    keys.forEach(key => {
        key.addEventListener('click', () => handleKeyClick(key.dataset.key));
    });

    function handleKeyClick(key) {
        if (gameOver) return;

        // if (col > 5){
        //     gameOver = true;
        //     return true;
        // }
        
      
        let color = checkIfCorrect(key); 
        shadeKeyBoard(key, color);

        console.log(`Key clicked: ${key}`);
        console.log(`Color: ${color}`)

    

        // update the key colors
    function shadeKeyBoard(letter, color) {
        document.querySelectorAll('.keyboard-button').forEach(button => {
            if (button.textContent === letter) {
                button.style.backgroundColor = color;
            }
        });


        row +=1 ;
        col +1;
    }


    function checkIfCorrect(letter) {
        
        // let guessIndex = guess.indexOf(letter);
        let wordIndex = word.indexOf(letter);

        console.log(`row: ${row}`)
        console.log(`wordIndex: ${wordIndex}`)

        if (wordIndex == -1) {
            return 'grey';
        }
        else if (wordIndex === row){
            return 'green';
        }
        else{
            return 'yellow'
        }

        
    }

    





    }

    // document.addEventListener('keydown', (e) => {
    //     const key = e.key.toLowerCase();
    //     const keyElement = document.querySelector(`button[data-key="${key}"]`);
    //     if (keyElement) {
    //         keyElement.click();
    //     }

        
    // })


    


});

