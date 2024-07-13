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
$_SESSION['score'] = 0;
$_SESSION['games_played'] = 0;
//$_SESSION['word'] = ''; // generate random word

function pickNewWord() {
    $word_list = file('words.txt', FILE_IGNORE_NEW_LINES); 
    $_SESSION['word'] = $word_list[array_rand($word_list, 1)];
    echo json_encode($_SESSION['word']);
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

    echo json_encode($letterCounts);
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
    echo json_encode($letterIndexMap);
    return $letterIndexMap;
}

/*pickNewWord();
countLetterOccurrences($_SESSION['word']);
getLetterIndexes($_SESSION['word']);*/


