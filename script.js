/*----- constants -----*/

const words = ["CHUNK", "CLOCK", "ADOPT", "DOZEN", "LAYER", "LEMON", "MEDAL"];
const winningMsg = "Congrats! You identified the wordle!";

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

function initialize() {
	numGuesses = 0;
	guesses = [];
	wordle = getRandomWord(words);
	gameMsg.innerText = "";
	losingMsg = `You've run out of guesses. The wordle was ${wordle}.`;
	currentGuess = "";
	currentGuessIdx = currentGuess.length - 1;
	playAgainBtn.style.visibility = "hidden";
	clearBoard();
}

function getRandomWord(words) {
	let randomIndex = Math.floor(Math.random() * words.length);
	return words[randomIndex];
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
		for (let i = 0; i < wordle.length; i++) {
			let currentBoardLetter = document.getElementById(
				`guess-${numGuesses}-idx-${i}`
			);
			if (wordle[i] === currentGuess[i]) {
				currentBoardLetter.style.backgroundColor = "rgb(95, 160, 89)";
				currentBoardLetter.style.color = "white";
			} else if (wordle.indexOf(currentGuess[i]) > -1) {
				currentBoardLetter.style.backgroundColor = "rgb(194, 171, 78)";
				currentBoardLetter.style.color = "white";
			} else {
				currentBoardLetter.style.backgroundColor = "rgb(109, 113, 115)";
				currentBoardLetter.style.color = "white";
			}
		}

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
		currentBoardLetter.style.backgroundColor = "rgb(95, 160, 89)";
		currentBoardLetter.style.color = "white";
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
			currentBoardLetter.style.color = "black";
		}
	}
}
