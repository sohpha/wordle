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
$_SESSION['word'] = ''; // generate random word