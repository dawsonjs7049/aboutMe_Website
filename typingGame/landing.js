localStorage.setItem("highscore", "null");
localStorage.setItem("averageWPM", "null");
localStorage.setItem("highscore", "null");
let buttons = document.querySelectorAll(".btn");

let test = buttons[0].innerText;
buttons.forEach(button => console.log("testing: " + button.style.color));

function selectNumber5(element) {
  removeSelected();
  localStorage.setItem("runs", "5");
  element.style.background = "lightgreen";
}

function selectNumber10(element) {
  removeSelected();
  localStorage.setItem("runs", "10");
  element.style.background = "lightgreen";
}

function selectNumber20(element) {
  removeSelected();
  localStorage.setItem("runs", "20");
  element.style.background = "lightgreen";
}

function removeSelected() {
  buttons.forEach(button => (button.style.background = "orange"));
}

function clearStats() {
  let scores = [0, 0, 0, 0, 0];
  localStorage.setItem("highscore", "0");
  localStorage.setItem("averageWPM", "0");
  localStorage.setItem("scores", JSON.stringify(scores));
}
