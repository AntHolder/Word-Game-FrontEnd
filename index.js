window.addEventListener("DOMContentLoaded", event => {
	let mainDiv = document.querySelector(".main-div");
	let wordCard = mainDiv.querySelector(".word-card");
	let formBox = document.createElement("div");
	let rhymesBox = document.createElement("div");
	let userForm = document.querySelector(".user-form");
	let userDiv = document.querySelector(".user-div");
	let gameOverDiv = document.querySelector(".game-over");
	let currentUser = " ";
	let name = " ";
	let timerH2 = document.querySelector(".timer");
	let startButton = document.querySelector(".play");
	let rhymesForm = document.querySelector(".rhymes-form");
	let scoreCard = document.querySelector(".current-score");
	let finalScore = document.querySelector(".final-score");
	let greeting = document.querySelector(".welcome-message");
	let currentScore = 0;
	let rightAnswers = [];
	let wordsArr = [];
	const wrong = new Audio("./sounds/wrong.mp3");
	const right = new Audio("./sounds/right.mp3");

	function startGame() {
		fetch("http://localhost:3000/words/")
			.then(response => {
				return response.json();
			})
			.then(data => {
				fetch(`http://localhost:3000/words/${populateRandomWord(data)}`, {
					mode: "cors"
				})
					.then(resp => resp.json())
					.then(data => {
						greeting.innerText = `Welcome, ${name}`;
						createWordBox(data);
						createFormBox();
						createRhymesBox();
						let rhymesForm = document.querySelector(".rhymes-form");
						rhymesForm.style.visibility = "hidden";
						currentScore = 0;
						scoreCard.innerText = `Score:${currentScore}`;
					});
			}); //.THEN
	} //START GAME()

	function populateRandomWord(data) {
		wordId = data.map(word => word.id);
		wordId.sample = function() {
			return this[Math.floor(Math.random() * this.length)];
		};

		return wordId.sample();
	}

	function createWordBox(data) {
		let wordBox = document.createElement("div");
		wordBox.className = "word-box";
		wordBox.innerHTML = `<h1 class = "game-word">${data.word}</h1>`;
		wordCard.innerHTML = `${wordBox.innerHTML}`;
	}

	function createFormBox() {
		formBox.className = "form-box";
		formBox.innerHTML = `
        <form class= "rhymes-form">
        <label for="lname">Rhymes</label><br>
        <input type="text" id="rhyme" name="rhyme" ><br><br>
        <input type="submit" value="Submit">
        </form> `;
		wordCard.append(formBox);
	}

	function createRhymesBox() {
		rhymesBox.className = "rhymes-box";
		rhymesBox.innerHTML = `<ul class= "rhymes-list"></ul>`;
		formBox.append(rhymesBox);
		let rhymesForm = document.querySelector(".rhymes-form");
	}

	mainDiv.addEventListener("submit", e => {
		e.preventDefault();

		let gameWord = document.querySelector(".game-word").innerText;
		let form = document.querySelector(".rhymes-form");
		let ul = document.querySelector(".rhymes-list");

		let input = document.querySelector("#rhyme").value;

		fetch(`https://api.datamuse.com/words?rel_rhy=${gameWord}`)
			.then(resp => resp.json())
			.then(resp => {
				wordsArr = resp.map(word => word.word);

				if (wordsArr.includes(input) && !rightAnswers.includes(input)) {
					right.play();
					ul.innerHTML += `<li class= "each-word">${input}</li>`;
					rightAnswers.push(input);
					currentScore++;
					scoreCard.innerText = `Score:${currentScore}`;
				} //IF STATEMENT
				else if (rightAnswers.includes(input)) {
					console.log("STOP CHEATING");
				} else if (!wordsArr.includes(input)) {
					wrong.play();
					console.log("That shit dont rhyme son");
				}

				form.reset();
			}); //.then
	}); //submit

	document.addEventListener("click", e => {
		switch (e.target.className) {
			case "play":
				let rhymesForm = document.querySelector(".rhymes-form");
				e.target.style.visibility = "hidden";
				rhymesForm.style.visibility = "visible";
				timerFunc();
				break;
			default:
				break;
		} //SWITCH
	}); //CLICK EVENTS

	function timerFunc() {
		let clear = setInterval(decrimentTimer, 1000);

		function decrimentTimer() {
			let newTime = parseInt(timerH2.innerHTML, 10);
			newTime--;
			timerH2.innerHTML = newTime;
			if (newTime <= 0) {
				clearInterval(clear);
				// let form = document.querySelector(".rhymes-form")
				// form.style.display = "none"
				finalScore.innerText = `YOUR SCORE:${currentScore}`;
				gameOverDiv.style.visibility = "visible";
				createGameInstance();
			} //IF STATEMENT
		} //Decrament
	} //timerFunc

	userForm.addEventListener("submit", e => {
		if (userForm.name.value && userForm.username.value) {
			e.preventDefault();
			nameInput = userForm.name.value;
			usernameInput = userForm.username.value;
			data = { name: nameInput, username: usernameInput };

			fetch("http://localhost:3000/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accepts: "application/json"
				},
				body: JSON.stringify(data)
			}) //FETCH
				.then(response => response.json())
				.then(user => {
					currentUser = user.id;
					name = nameInput;
					userDiv.style.visibility = "hidden";
					startGame();
				}); //.THEN
		} else {
			alert("You must enter both a name and username");
		} //IF ELSE
	}); //USERNAME SUBMIT LISTENER

	gameOverDiv.addEventListener("click", e => {
		let playAgainbutton = document.querySelector(".play-again");
		if (e.target.className === "play-again") {
			gameOverDiv.style.visibility = "hidden";
			startButton.style.visibility = "visible";
			currentScore = 0;
			scoreCard.innerText = `Score:${currentScore}`;
			startGame();
			timerH2.innerHTML = 60;
		}
	}); //GAME OVER LISTENER

	function createGameInstance() {
		let data = { score: currentScore, user_id: currentUser };
		fetch("http://localhost:3000/games", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify(data)
		}) //FETCH
			.then(resp => resp.json())
			.then();
	} //CREATE GAME()
}); //dom

//invisible div for user login and to show score
//that score should append to the side of the page to see other users scores.
//new game button that refreshes the page
//set up score to increase when input correct*
//css
