/*----- constants -----*/

const winningMsg = "Congrats! You identified the wordle!";
const green = "rgb(95, 160, 89)";
const yellow = "rgb(194, 171, 78)";
const gray = "rgb(109, 113, 115)";
const url = "https://random-word-api.herokuapp.com/word?length=5";

/*----- state variables -----*/

let numGuesses;
let guesses;
let wordle;
let losingMsg;

/*----- cached elements  -----*/

const gameMsg = document.getElementById("game-msg");
const playAgainBtn = document.querySelector("button");

/*----- event listeners -----*/

document
	.getElementById("keyboard")
	.addEventListener("click", handleKeyboardClick);
playAgainBtn.addEventListener("click", initialize);

/*----- functions -----*/

initialize();

async function initialize() {
	numGuesses = 0;
	guesses = [];
	wordle = await getRandomWordViaAPI();
	gameMsg.innerText = "";
	losingMsg = `You've run out of guesses. The wordle was ${wordle}.`;
	currentGuess = "";
	currentGuessIdx = currentGuess.length - 1;
	playAgainBtn.style.visibility = "hidden";
	clearBoard();
	clearKeyboardColors();
}

function handleKeyboardClick(e) {
	const key = e.target.innerText;
	if (key === "ENTER") {
		handleEnter();
	} else if (key === "") {
		handleDelete();
	} else {
		currentGuess += key;
		currentGuessIdx = currentGuess.length - 1;
		document.getElementById(
			`guess-${numGuesses}-idx-${currentGuessIdx}`
		).innerText = key;
	}
}

function handleDelete() {
	if (currentGuess === "") {
		return;
	}
	currentGuessIdx = currentGuess.length - 1;
	document.getElementById(
		`guess-${numGuesses}-idx-${currentGuessIdx}`
	).innerText = "";
	currentGuess = currentGuess.slice(0, -1);
}

function handleEnter() {
	if (currentGuess.length !== 5) {
		return;
	}

	if (currentGuess === wordle) {
		renderWin();
	} else {
		compareGuessToWordle();
		numGuesses++;
		currentGuess = "";

		if (numGuesses === 6) {
			renderLoss();
		}
	}
}

function renderWin() {
	gameMsg.innerText = winningMsg;
	playAgainBtn.style.visibility = "visible";

	for (let i = 0; i < wordle.length; i++) {
		let currentBoardLetter = document.getElementById(
			`guess-${numGuesses}-idx-${i}`
		);
		let currentKeyboard = document.getElementById(`${wordle[i]}`);
		updateElementColor(currentBoardLetter, green);
		updateElementColor(currentKeyboard, green);
	}
}

function renderLoss() {
	gameMsg.innerText = losingMsg;
	playAgainBtn.style.visibility = "visible";
}

function clearBoard() {
	for (let row = 0; row < 6; row++) {
		for (let idx = 0; idx < 5; idx++) {
			let currentBoardLetter = document.getElementById(
				`guess-${row}-idx-${idx}`
			);
			currentBoardLetter.innerText = "";
			currentBoardLetter.style.backgroundColor = "white";
			currentBoardLetter.style.outlineColor = "lightgray";
			currentBoardLetter.style.color = "black";
		}
	}
}

function clearKeyboardColors() {
	let row1 = document.querySelectorAll(".keyboard-row-1 > div");
	row1.forEach((element) => {
		element.style.backgroundColor = "lightgray";
		element.style.color = "black";
	});

	let row2 = document.querySelectorAll(".keyboard-row-2 > div");
	row2.forEach((element) => {
		element.style.backgroundColor = "lightgray";
		element.style.color = "black";
	});

	let row3 = document.querySelectorAll(".keyboard-row-3 > div");
	row3.forEach((element) => {
		element.style.backgroundColor = "lightgray";
		element.style.color = "black";
	});
}

function compareGuessToWordle() {
	let wordleLetterCount = getLetterCount(wordle);

	for (let i = 0; i < wordle.length; i++) {
		let currentBoardLetter = document.getElementById(
			`guess-${numGuesses}-idx-${i}`
		);
		let wordleChar = wordle[i];
		let guessChar = currentGuess[i];
		let currentKeyboard = document.getElementById(`${guessChar}`);

		if (wordleChar === guessChar) {
			wordleLetterCount[wordleChar]--;
			updateElementColor(currentBoardLetter, green);
			updateElementColor(currentKeyboard, green);
		} else if (wordle.indexOf(guessChar) > -1) {
			if (wordleLetterCount[guessChar] > 0) {
				updateElementColor(currentBoardLetter, yellow);
				if (currentKeyboard.style.backgroundColor !== green) {
					updateElementColor(currentKeyboard, yellow);
				}
			} else {
				updateElementColor(currentBoardLetter, gray);
				if (currentKeyboard.style.backgroundColor !== green) {
					updateElementColor(currentKeyboard, gray);
				}
			}
			wordleLetterCount[wordleChar]--;
		} else {
			updateElementColor(currentBoardLetter, gray);
			if (currentKeyboard.style.backgroundColor !== green) {
				updateElementColor(currentKeyboard, gray);
			}
		}
	}
}

function getLetterCount(word) {
	const letterCount = {};
	for (let i = 0; i < word.length; i++) {
		if (word[i] in letterCount) {
			letterCount[word[i]]++;
		} else {
			letterCount[word[i]] = 1;
		}
	}
	return letterCount;
}

async function getRandomWordViaAPI() {
	const response = await fetch(url);
	const result = await response.json();
	const word = result[0].toString();
	return word.toUpperCase();
}

function updateElementColor(element, color) {
	element.style.backgroundColor = color;
	element.style.outlineColor = color;
	element.style.color = "white";
}
