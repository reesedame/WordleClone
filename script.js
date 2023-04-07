/*----- constants -----*/

const winningMsg = "Congrats! You identified the wordle!";
const green = "rgb(95, 160, 89)";
const yellow = "rgb(194, 171, 78)";
const gray = "rgb(109, 113, 115)";
const words = [
	"WHICH",
	"THEIR",
	"THERE",
	"WOULD",
	"ABOUT",
	"FIRST",
	"AFTER",
	"KAYAK",
	"WHERE",
	"BEING",
	"YEARS",
	"AMONG",
	"UNTIL",
	"WOMEN",
	"EARLY",
	"HEART",
	"BLACK",
	"WHITE",
	"APPLE",
	"LOCAL",
	"VALUE",
	"STUDY",
	"HOUSE",
	"LARGE",
	"THINK",
	"CYCLE",
	"DELAY",
	"ELITE",
	"FAULT",
	"GHOST",
	"IDEAL",
	"JUICE",
	"ONION",
	"PIANO",
	"QUICK",
	"RATIO",
	"STAGE",
	"URBAN",
	"TOOTH",
	"VITAL",
	"WORLD",
	"ROUTE",
	"MOUSE",
	"HUMOR",
	"OUGHT",
	"FRUIT",
	"POWER",
	"YIELD",
	"SHOUT",
	"IMPLY",
];

/*----- state variables -----*/

let numGuesses;
let wordle;
let losingMsg;
let colorTheme;

/*----- cached elements  -----*/

const gameMsg = document.getElementById("game-msg");
const playAgainBtn = document.getElementById("play-btn");
const toggleColorThemeBtn = document.getElementById("theme-btn");

/*----- event listeners -----*/

document
	.getElementById("keyboard")
	.addEventListener("click", handleKeyboardClick);

playAgainBtn.addEventListener("click", initialize);

toggleColorThemeBtn.addEventListener("click", toggleColorTheme);

/*----- functions -----*/

initialize();

function initialize() {
	numGuesses = 0;
	wordle = getRandomWord(words);
	gameMsg.innerText = "";
	losingMsg = `You've run out of guesses. The wordle was ${wordle}.`;
	currentGuess = "";
	currentGuessIdx = 0;
	playAgainBtn.style.visibility = "hidden";
	colorTheme = true;
	clearGuessesBoard();
	clearKeyboardColors();
}

function handleKeyboardClick(e) {
	// ignore click if it is not directly on a key
	if (
		e.target === document.getElementById("keyboard") ||
		e.target === document.getElementById("keyboard-row-1") ||
		e.target === document.getElementById("keyboard-row-2") ||
		e.target === document.getElementById("keyboard-row-3")
	) {
		return;
	}

	const key = e.target.innerText;
	if (key === "ENTER") {
		handleEnter();
	} else if (key === "") {
		handleDelete();
	} else if (currentGuess.length < 5) {
		currentGuess += key;
		currentGuessIdx = currentGuess.length - 1;
		document.getElementById(
			`guess-${numGuesses}-idx-${currentGuessIdx}`
		).innerText = key;
	} else {
		return;
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
	// do not allow player to enter a guess less than 5 characters
	if (currentGuess.length !== 5) {
		return;
	}

	if (currentGuess === wordle) {
		renderWin();
	} else {
		compareGuessToWordle();
		numGuesses++;
		currentGuess = "";

		// player is only allowed 5 guesses
		if (numGuesses === 6) {
			renderLoss();
		}
	}
}

// displays winningMsg, playAgainBtn, & makes the winning guess and keyboard letters green
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

// displays losingMsg & playAgainBtn
function renderLoss() {
	gameMsg.innerText = losingMsg;
	playAgainBtn.style.visibility = "visible";
}

// renders an empty board for guesses
function clearGuessesBoard() {
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

// renders all keyboard chars with a lightgray background
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
	let guessLetterCount = getLetterCount(currentGuess);

	for (let i = 0; i < wordle.length; i++) {
		let currentBoardLetter = document.getElementById(
			`guess-${numGuesses}-idx-${i}`
		);
		let wordleChar = wordle[i];
		let guessChar = currentGuess[i];
		let currentKeyboard = document.getElementById(`${guessChar}`);

		// renders currentBoardLetter as green if it's in the correct position
		if (wordleChar === guessChar) {
			wordleLetterCount[wordleChar]--;
			guessLetterCount[guessChar]--;
			updateElementColor(currentBoardLetter, green);
			updateElementColor(currentKeyboard, green);
		} else if (
			// determines if currentBoardLetter is in the wordle; letter counts are used to handle duplicates
			wordleLetterCount[guessChar] >= guessLetterCount[guessChar]
		) {
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
			wordleLetterCount[guessChar]--;
			guessLetterCount[guessChar]--;
		} else {
			// currentBoardLetter is not in the wordle & rendered as gray
			updateElementColor(currentBoardLetter, gray);
			if (currentKeyboard.style.backgroundColor !== green) {
				updateElementColor(currentKeyboard, gray);
			}
			guessLetterCount[guessChar]--;
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

function getRandomWord(words) {
	let randomIdx = Math.floor(Math.random() * words.length);
	return words[randomIdx];
}

// changes an element's background to provided color & text color changes to white
function updateElementColor(element, color) {
	element.style.backgroundColor = color;
	element.style.outlineColor = color;
	element.style.color = "white";
}

function toggleColorTheme() {
	colorTheme = !colorTheme;
	changeColorTheme(colorTheme);
}

// if colorTheme is true, background is white & text is black
// else, background is dark gray & text is white
function changeColorTheme(colorTheme) {
	let body = document.querySelector("body");
	let gameTitle = document.querySelector("h1");

	if (colorTheme) {
		body.style.backgroundColor = "white";
		gameTitle.style.color = "black";
		gameMsg.style.color = "black";
	} else {
		body.style.backgroundColor = "rgb(35, 36, 32)";
		gameTitle.style.color = "white";
		gameMsg.style.color = "white";
	}
}
