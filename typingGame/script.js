const RANDOM_QUOTE_API_URL = "https://type.fit/api/quotes";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const statWrapper = document.getElementById("statWrapper");
const timerElement = document.getElementById("timer");
const authorSpan = document.getElementById("author");
const wpmSpan = document.getElementById("wpm");
const statsDiv = document.getElementsByClassName("statsArea");
const nextButton = document.getElementById("nextButton");
const nextLink = document.getElementById("nextLink");
const statAudio = document.getElementById("statAudio");

let quotes = [];
let authors = [];
let wordCount = 0;
let runCount = parseInt(localStorage.getItem("runs")) - 1;
const numRuns = parseInt(localStorage.getItem("runs"));
let runningWPM = 0;

async function asyncGetRandomQuote() {
  const test = await getQuotes();

  quotes = test.map(a => a.text);
  authors = test.map(b => b.author);
}

asyncGetRandomQuote();

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

sleep(500).then(() => {
  renderRandomQuote();
});

let scores = JSON.parse(localStorage.getItem("scores"));
if (scores === undefined || scores === null) {
  let scores = [0, 0, 0, 0, 0];
  localStorage.setItem("scores", JSON.stringify(scores));
}

statAudio.loop = true;
statAudio.volume = .5;
statAudio.play();

nextLink.addEventListener("click", () => {
  let averageWPM = runningWPM / numRuns;
  localStorage.setItem("averageWPM", averageWPM);

  let isHigherScore = false;
  scores.forEach(element => {
    if (averageWPM > element) {
      isHigherScore = true;
    }
  });
  if (isHigherScore) {
    localStorage.setItem("highscore", "true");
  } else {
    localStorage.setItem("highscore", "false");
  }
  scores.push(averageWPM);
  scores.sort((a, b) => b - a);
  scores.length = 5;
  localStorage.setItem("scores", JSON.stringify(scores));
});

quoteInputElement.addEventListener("input", () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");

  let string = quoteDisplayElement.innerText;
  wordCount = string.split(" ").length;

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      correct = false;
    }
  });

  if (correct && quoteDisplayElement.innerText === quoteInputElement.value) {
    let minutes = parseInt(timerElement.innerText) / 60;
    let wpm = parseInt((wordCount / minutes).toFixed(2));
    runningWPM += wpm;
    wpmSpan.innerText = "WPM: " + wpm;
    statWrapper.classList.remove("hidden");
    quoteInputElement.disabled = true;
    nextButton.focus();
  }
});

function getQuotes() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      return json;
    });
}

function renderRandomQuote() {
  quoteInputElement.focus();
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const author = authors[randomIndex];
  if (author === null) {
    authorSpan.innerText = "Author: Unknown";
  } else {
    authorSpan.innerText = "Author: " + author;
  }

  quoteDisplayElement.innerHTML = "";
  randomQuote.split("").forEach(character => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
  if (runCount === 1) {
    nextButton.classList.add("invisible");
    nextLink.classList.remove("invisible");
  }
  startTimer();
}

let startTime;
function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  setInterval(() => {
    timer.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function nextQuote() {
  statWrapper.classList.add("hidden");
  quoteInputElement.disabled = false;
  renderRandomQuote();
  runCount--;
}
