<?php

session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Page is being refreshed after a POST request
    if (isset($_SESSION['last_request_method']) && $_SESSION['last_request_method'] == 'POST') {
        // Reset or clear session variables here as needed
        unset($_SESSION['current_column']); // Unset specific variable
        // Or clear all session data:
        // session_unset(); // Unset all session variables
        // session_destroy(); // Destroy the session
    }

    // Update last request method in session
    $_SESSION['last_request_method'] = 'POST';
}

header('Content-Type: application/json');

const NUM_ATTEMPTS = 6;
const NUM_LETTERS = 5;
const GREEN = '#6aaa64';
const YELLOW = '#c9b458';
const GRAY = '#787c7e';

// $_SESSION['current_column'] = 0;
// $current_column = 0;

// $_SESSION['cell_colors'] = []; // json encoding: {"index":"color", ...}
// $_SESSION['key_colors'] = []; // json enconding: {"key": "color", ...}
// $_SESSION['score'] = 0;
// $_SESSION['games_played'] = 0;
// $_SESSION['game_over'] = false;

//$_SESSION['word'] = ''; // generate random word






function initializeGame()
{
    $_SESSION["game_state"] = [
        'current_row' => 0,
        'current_column' => -1,

        // 'word' => pickNewWord(), 
        'word' => 'apple',

        'score' => 0,

        'games_played' => 0,
        'game_over' => false,

        'guess' => [],

        // wins
        'consecutive_wins' => 0,
        'top_streaks' => [],

        'cell_colors' => [], // json encoding: {"index":"color", ...}
        'key_colors' => [] // json enconding: {"key": "color", ...}

    ];
}



// after calling this function, $_SESSION['cell_colors'] will contain
// the color e/ cell in the current row (i.e. $_SESSION['current_row']) should have and $_SESSION['key_colors'] will
// contain the color certain keys should have
// returns true/false depending on whether guess was correct
function processAttempt($guess, $word)
{

    // correct guess
    if (strcmp($guess, $word) == 0) {
        for ($i = 0; $i < strlen($guess); $i++) {
            $letter = substr($guess, $i, 1);
            //color cell gray
            $_SESSION['game_state']['cell_colors'][$i] = 'green';

            //color keyboard gray
            $_SESSION['game_state']['key_colors'][strtoupper($letter)] = 'green';
        }
        return true; // correct guess
    }

    $letterCounts = countLetterOccurrences($word);

    // Find the absent letters and letters in correct position
    for ($i = 0; $i < strlen($guess); $i++) {
        $letter = substr($guess, $i, 1);

        // letter not present
        if (!isset($_SESSION['game_state']['word_indexes'][$letter])) {
            //color cell gray
            $_SESSION['game_state']['cell_colors'][$i] = 'gray';

            //color keyboard gray
            $_SESSION['game_state']['key_colors'][strtoupper($letter)] = 'gray';

        } elseif (in_array($i, $_SESSION['game_state']['word_indexes'][$letter])) {
            $letterCounts[$letter]--;
            $_SESSION['game_state']['cell_colors'][$i] = 'green';
            $_SESSION['game_state']['key_colors'][strtoupper($letter)] = 'green';
        }

    }

    // Handle yellow letters
    for ($i = 0; $i < strlen($guess); $i++) {
        $letter = substr($guess, $i, 1);
        if (!isset($_SESSION['game_state']['word_indexes'][$letter]) || in_array($i, $_SESSION['game_state']['word_indexes'][$letter])) {
            continue;
        } elseif ($letterCounts[$letter] > 0) {
            $letterCounts[$letter]--;
            $_SESSION['game_state']['cell_colors'][$i] = 'yellow';
            $_SESSION['game_state']['key_colors'][strtoupper($letter)] = 'yellow';

        } else { // no more occurrences of letter in word
            $_SESSION['game_state']['cell_colors'][$i] = 'gray';
        }


    }

    // echo json_encode($_SESSION['game_state']);
    return false; // incorrect guess

}

// pickNewWord();
// processAttempt("solar",$_SESSION['word']);

function pickNewWord()
{
    $word_list = file('words.txt', FILE_IGNORE_NEW_LINES);
    $_SESSION['word'] = $word_list[array_rand($word_list, 1)];
    $_SESSION['word_indexes'] = getLetterIndexes($_SESSION['word']);
}


function countLetterOccurrences($word)
{
    $letterCounts = [];

    for ($i = 0; $i < strlen($word); $i++) {
        $letter = $word[$i];
        if (isset($letterCounts[$letter])) {
            $letterCounts[$letter]++;
        } else {
            $letterCounts[$letter] = 1;
        }

    }

    return $letterCounts;

}

function getLetterIndexes($word)
{
    $letterIndexMap = [];

    for ($i = 0; $i < strlen($word); $i++) {
        $letter = $word[$i];

        if (isset($letterIndexMap[$letter])) {
            $letterIndexMap[$letter][] = $i;
        } else {
            $letterIndexMap[$letter] = [$i];
        }
    }

    return $letterIndexMap;
}


// initializeGame();



// Initialize game session if not set
if (!isset($_SESSION['game_state'])) {
    initializeGame();
}




// Receive guessed letter from $_GET
$key = $_GET['key'] ?? '';
error_log('$_GET key: ' . $key);



if ($key == 'backspace' && $_SESSION['game_state']['current_column'] >= 0 ){

    
    array_pop($_SESSION['game_state']['guess']);
    $_SESSION['game_state']['current_column'] --;


}

elseif ($key == 'enter' &&  $_SESSION['game_state']['current_column'] == NUM_LETTERS - 1 && !$_SESSION['game_state']['game_over']){
    $guessWord = implode("", $_SESSION['game_state']['guess']);

     $correct_guess = processAttempt($guessWord, 'apple');


    // $correct_guess = false;

    if ($correct_guess){
        $_SESSION['game_state']['score'] ++;
        $_SESSION['game_state']['game_over'] = true;
        
        // Play again  to be implemented
    }


    else{
        $_SESSION['game_state']['current_row'] ++;
        $_SESSION['game_state']['current_column'] = -1;

        if ($_SESSION['game_state']['current_row'] == NUM_ATTEMPTS){
            
            $_SESSION['game_state']['game_over'] = true;
            // reveal the word
            // revealWord();
            // Play again  to be implemented
            // playAgain();
        }
    }
    $_SESSION['game_state']['guess'] = [];
    // error_log("Score: ". $_SESSION['game_state']['score']); 
    // error_log("GameOver? " . $_SESSION['game_state']['game_over'] ? 'true' : 'false');


}
elseif (strlen($key) == 1 && $_SESSION['game_state']['current_column'] < NUM_LETTERS -1 ){

    $_SESSION['game_state']['current_column'] ++;
    $_SESSION['game_state']['guess'] [] = $key;

}




$response = [
    'gameState' => $_SESSION['game_state'],
    'currentCol' => $_SESSION['game_state']['current_column'],
    'currentRow' => $_SESSION['game_state']['current_row'] ,

   

];



// Send JSON response back to JavaScript
echo json_encode($response);