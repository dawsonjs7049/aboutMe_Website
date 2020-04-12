let scores = JSON.parse(localStorage.getItem("scores"));
const isHighScore = localStorage.getItem("highscore");
const userScore = localStorage.getItem("averageWPM");

const scoreContainer = document.getElementById("scoreContainer");
const statAudio = document.getElementById("statAudio");

// statAudio.loop = true;
// statAudio.play();

scores.forEach((element, index) => {
  let score = document.createElement("div");
  if (index === 0) {
    score.innerText = "# " + (index + 1) + " - " + element + " wpm\n";
  } else {
    score.innerText = "#" + (index + 1) + " - " + element + " wpm\n";
  }
  score.classList.add("scoreDiv");
  scoreContainer.appendChild(score);
});

const spacerDiv = document.createElement("div");
spacerDiv.classList.add("spacerDiv");
spacerDiv.innerHTML = "&nbsp";
scoreContainer.appendChild(spacerDiv);

if (userScore !== "null") {
  if (isHighScore) {
    const highScoreBanner = document.createElement("div");
    highScoreBanner.innerText = "New Top Score!";
    highScoreBanner.classList.add("highscoreBanner");
    scoreContainer.appendChild(highScoreBanner);
  }
  const userScoreDiv = document.createElement("div");
  userScoreDiv.innerText = "Your Score: " + userScore + " wpm";
  userScoreDiv.classList.add("userScoreDiv");
  scoreContainer.appendChild(userScoreDiv);
}

function clearStats() {
  let scores = [0, 0, 0, 0, 0];
  localStorage.setItem("highscore", "null");
  localStorage.setItem("averageWPM", "null");
  localStorage.setItem("scores", JSON.stringify(scores));
  window.location.href = "./stats.html";
}
