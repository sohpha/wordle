<?php

session_start();
header('Content-Type: application/json');

const NUM_ATTEMPTS = 6; 
const NUM_LETTERS = 5; 
const GREEN = '#6aaa64';
const YELLOW = '#c9b458';
const GRAY = '#787c7e';

$_SESSION['current_row'] = 0;
$_SESSION['current_column'] = 0;
$_SESSION['cell_colors'] = []; // json encoding: {"index":"color", ...}
$_SESSION['key_colors'] = []; // json enconding: {"key": "color", ...}
$_SESSION['score'] = 0;
$_SESSION['games_played'] = 0;
$_SESSION['game_over'] = false;
//$_SESSION['word'] = ''; // generate random word

// after calling this function, $_SESSION['cell_colors'] will contain
// the color e/ cell in the current row (i.e. $_SESSION['current_row']) should have and $_SESSION['key_colors'] will
// contain the color certain keys should have
// returns true/false depending on whether guess was correct
function processAttempt($guess, $word) {
    
    // correct guess
    if(strcmp($guess, $word) == 0) {
        for($i = 0; $i < strlen($guess); $i++) {
            $letter = substr($guess, $i, 1);
            //color cell gray
            $_SESSION['cell_colors'][$i] = 'green';

            //color keyboard gray
            $_SESSION['key_colors'][strtoupper($letter)] = 'green';
        }
        return true; // correct guess
    }

    $letterCounts = countLetterOccurrences($word);

    // Find the absent letters and letters in correct position
    for($i = 0; $i < strlen($guess); $i++) {
        $letter = substr($guess, $i, 1);

        // letter not present
        if(!isset($_SESSION['word_indexes'][$letter])) {
            //color cell gray
            $_SESSION['cell_colors'][$i] = 'gray';

            //color keyboard gray
            $_SESSION['key_colors'][strtoupper($letter)] = 'gray';

        } elseif (in_array($i, $_SESSION['word_indexes'][$letter])) {
            $letterCounts[$letter]--;
            $_SESSION['cell_colors'][$i] = 'green';
            $_SESSION['key_colors'][strtoupper($letter)] = 'green';
        }
      
    }

    // Handle yellow letters
    for($i = 0; $i < strlen($guess); $i++) {
        $letter = substr($guess, $i, 1);
        if(!isset($_SESSION['word_indexes'][$letter]) ||in_array($i, $_SESSION['word_indexes'][$letter]) ) {
            continue;
        } elseif ($letterCounts[$letter] > 0) {
            $letterCounts[$letter]--;
            $_SESSION['cell_colors'][$i] = 'yellow';
            $_SESSION['key_colors'][strtoupper($letter)] = 'yellow';

        } else { // no more occurrences of letter in word
            $_SESSION['cell_colors'][$i] = 'gray';
        }


    }

    echo json_encode($_SESSION);
    return false; // incorrect guess
    
}

pickNewWord();
processAttempt("solar",$_SESSION['word']);

function pickNewWord() {
    $word_list = file('words.txt', FILE_IGNORE_NEW_LINES); 
    $_SESSION['word'] = $word_list[array_rand($word_list, 1)];
    $_SESSION['word_indexes'] = getLetterIndexes($_SESSION['word']);
}


function countLetterOccurrences($word) {
    $letterCounts = [];

    for ($i = 0; $i < strlen($word); $i++) {
        $letter = $word[$i];
        if(isset($letterCounts[$letter])) {
            $letterCounts[$letter]++;
        } else {
            $letterCounts[$letter] = 1;
        }

    }

    return $letterCounts;
 
}

function getLetterIndexes($word) {
    $letterIndexMap = [];

    for($i = 0; $i < strlen($word); $i++) {
        $letter = $word[$i];

        if (isset($letterIndexMap[$letter])) {
            $letterIndexMap[$letter][] = $i;
        } else {
            $letterIndexMap[$letter] = [$i];
        }
    }

    return $letterIndexMap;
}



