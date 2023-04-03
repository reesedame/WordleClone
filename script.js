/*----- constants -----*/

const words = ["CHUNK", "CLOCK", "ADOPT", "DOZEN", "LAYER", "LEMON", "MEDAL"];
const winningMsg = "Congrats! You identified the wordle!";

/*----- state variables -----*/

let numGuesses;
let guesses;
let wordle;

/*----- cached elements  -----*/

const gameMsg = document.getElementById("game-msg");

/*----- event listeners -----*/

document
	.getElementById("keyboard")
	.addEventListener("click", handleKeyboardClick);

/*----- functions -----*/

initialize();

function initialize() {
	numGuesses = 0;
	guesses = [];
	wordle = getRandomWord(words);
	currentGuess = "";
	currentGuessIdx = currentGuess.length - 1;
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
