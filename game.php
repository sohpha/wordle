<?php

session_start();


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
        'current_column' => 0,

       
        'word' => '',
        // pickNewWord(), 

        'score' => 0,

        'games_played' => 0,
        'game_over' => false,

        'guess' => [],

        // wins
        'consecutive_wins' => 0,
        'top_streaks' => [],

        'cell_colors' => [], // json encoding: {"index":"color", ...}
        'key_colors' => [], // json enconding: {"key": "color", ...}
        'max_letters_reached' => false

    ];
}




// Initialize game session if not set
if (!isset($_SESSION['game_state'])) {
    initializeGame();
    pickNewWord();
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
            //color cell green
            $_SESSION['game_state']['cell_colors'][$i] = GREEN;

            //color keyboard green
            $_SESSION['game_state']['key_colors'][strtoupper($letter)] = GREEN;
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
            $_SESSION['game_state']['cell_colors'][$i] = GRAY;

            //color keyboard gray
            $_SESSION['game_state']['key_colors'][strtoupper($letter)] = GRAY;

        } elseif (in_array($i, $_SESSION['game_state']['word_indexes'][$letter])) {
            $letterCounts[$letter]--;
            $_SESSION['game_state']['cell_colors'][$i] = GREEN;
            $_SESSION['game_state']['key_colors'][strtoupper($letter)] = GREEN;
        }

    }

    // Handle yellow letters
    for ($i = 0; $i < strlen($guess); $i++) {
        $letter = substr($guess, $i, 1);
        if (!isset($_SESSION['game_state']['word_indexes'][$letter]) || in_array($i, $_SESSION['game_state']['word_indexes'][$letter])) {
            continue;
        } elseif ($letterCounts[$letter] > 0) {
            $letterCounts[$letter]--;
            $_SESSION['game_state']['cell_colors'][$i] = YELLOW;
            $_SESSION['game_state']['key_colors'][strtoupper($letter)] = YELLOW;

        } else { // no more occurrences of letter in word
            $_SESSION['game_state']['cell_colors'][$i] = GRAY;
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
    $_SESSION['game_state']['word'] = $word_list[array_rand($word_list, 1)];
    $_SESSION['game_state']['word_indexes'] = getLetterIndexes($_SESSION['game_state']['word']);
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


// Receive guessed letter from $_GET
$key = $_GET['key'] ?? '';


if ($key == 'reset') {
    initializeGame();
    pickNewWord();
} elseif($key == 'playAgain'){
    playAgain();
} elseif ($key == 'backspace' && $_SESSION['game_state']['current_column'] > 0) { // used to be >=

    array_pop($_SESSION['game_state']['guess']);
    $_SESSION['game_state']['current_column']--;
    $_SESSION['game_state']['max_letters_reached'] = false; // reset

} elseif ($key == 'enter' && $_SESSION['game_state']['current_column'] == NUM_LETTERS  && !$_SESSION['game_state']['game_over']) {
    $_SESSION['game_state']['max_letters_reached'] = false; // reset
    $guessWord = implode("", $_SESSION['game_state']['guess']);
    $word = $_SESSION['game_state']['word'];
    error_log('$word: '.$word);

    // need to reset cell_colors and key_colors
    $correct_guess = processAttempt($guessWord, $word);

    if ($correct_guess) {
        $_SESSION['game_state']['score']++;
        $_SESSION['game_state']['games_played']++;
        $_SESSION['game_state']['consecutive_wins']++;
        $_SESSION['game_state']['current_row']++; // needed to update ui
        $_SESSION['game_state']['game_over'] = true;

        // Play again  to be implemented
    } else {
        $_SESSION['game_state']['current_row']++;
        $_SESSION['game_state']['current_column'] = 0;

        if ($_SESSION['game_state']['current_row'] == NUM_ATTEMPTS) {

            // reveal the word
            $_SESSION['game_state']['game_over'] = true;
            $_SESSION['game_state']['games_played']++;

            // add consecutive_wins
            $consecutive_wins = $_SESSION['game_state']['consecutive_wins'];
            $_SESSION['game_state']['top_streaks'][] = $consecutive_wins;
            $_SESSION['game_state']['consecutive_wins'] = 0;
        }

    }
    $_SESSION['game_state']['guess'] = [];
    
    // error_log("Score: " . $_SESSION['game_state']['score']);
    // error_log("GameOver? " . $_SESSION['game_state']['game_over'] ? 'true' : 'false');

} elseif (strlen($key) == 1 && $_SESSION['game_state']['current_column'] < NUM_LETTERS ) {

    $_SESSION['game_state']['current_column']++;
    $_SESSION['game_state']['guess'][] = $key;

} elseif (strlen($key) == 1 && $_SESSION['game_state']['current_column'] >= NUM_LETTERS) {
    $_SESSION['game_state']['max_letters_reached'] = true; //do not update ui if user already inputted 5 letters w/o deleting any

}



$response = [
    
    'gameState' => $_SESSION['game_state'],

    'currentCol' => $_SESSION['game_state']['current_column'],
    'currentRow' => $_SESSION['game_state']['current_row'],

    'cellColors' => $_SESSION['game_state']['cell_colors'],
    'keyColors' => $_SESSION['game_state']['key_colors'],

    'gamesPlayed' => $_SESSION['game_state']['games_played'],
    'score' => $_SESSION['game_state']['score'],

    'gameOver'  => $_SESSION['game_state']['game_over'],

    'word' =>  $_SESSION['game_state']['word'],

    'topStreaks' =>  $_SESSION['game_state']['top_streaks'],
    'maxLettersReached' =>  $_SESSION['game_state']['max_letters_reached']

];
echo json_encode($response);


function playAgain(){
    $_SESSION['game_state']['game_over'] = false;
    // $_SESSION['game_state']['games_played'] ++;

    // reset
    $_SESSION['game_state']['guess'] = [];
    $_SESSION['game_state']['cell_colors'] = [];
    $_SESSION['game_state']['key_colors'] = [];
    $_SESSION['game_state']['current_column'] = 0;
    $_SESSION['game_state']['current_row'] = 0;

    pickNewWord();

    // updateScoreboard();

}

// Send JSON response back to JavaScript
// $_SESSION['game_state'] = [];
// session_destroy();

