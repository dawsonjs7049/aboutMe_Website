const cvs = document.getElementById("snake");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart");
const resultSpan = document.getElementById("resultSpan");

document.addEventListener("keydown", direction);

const ctx = cvs.getContext("2d");

//create unit
const box = 32;

//load images
const ground = new Image();
ground.src = "./ground.png";

const foodImg = new Image();
foodImg.src = "./food.png";

//load audio files
const dead = new Audio();
const eat = new Audio();
const up = new Audio();
const left = new Audio();
const right = new Audio();
const down = new Audio();

dead.src = "dead.mp3";
eat.src = "eat.mp3";
up.src = "up.mp3";
left.src = "left.mp3";
right.src = "right.mp3";
down.src = "down.mp3";

// player direction
let d;
let game;

//create snake
let snake = [];
snake[0] = {
  x : 9 * box,
  y : 8 * box
};

//create ai snake
let aiSnake = [];
aiSnake[0] = {
  x : 9 * box,
  y : 12 * box
};

//create the food
let food = {};

//create the score var
let score = 0;
let aiScore = 0;

console.log("drawing ground");
ctx.drawImage(ground,0,0);

startBtn.addEventListener('click', () => {
  
  // start game for first time
  spawnFood();

  startBtn.style.display = "none";
  restartBtn.style.display = "block";

  game = setInterval(draw,100);
  console.log("INSIDE START BTN LISTENER");
});

restartBtn.addEventListener('click', () => {
  spawnFood();

  //create snake
  snake = [];
  snake[0] = {
    x : 9 * box,
    y : 8 * box
  };

  //create ai snake
  aiSnake = [];
  aiSnake[0] = {
    x : 9 * box,
    y : 12 * box
  };

  d = "";
  score = 0;
  aiScore = 0;

  resultSpan.style.display = "none";

  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.drawImage(ground,0,0);

  game = setInterval(draw,100);
  console.log("INSIDE RESTART BTN LISTENER");
});

// FUNCTIONS
function spawnFood()
{
  let foodPosition = {
    x : Math.floor(Math.random() * 17 + 1) * box,
    y : Math.floor(Math.random() * 15 + 3) * box
  }

  while(snakeCollisions(foodPosition, foodPosition, snake, aiSnake))
  {
    // will loop until the food position does not collide with either snake
    foodPosition = {
      x : Math.floor(Math.random() * 17 + 1) * box,
      y : Math.floor(Math.random() * 15 + 3) * box
    }
  }

  // set the food position to new found position
  food = foodPosition;
}

function direction(event){
  let key = event.keyCode;
  if(key == 37 && d != "RIGHT"){
    d = "LEFT";
    left.play();
  }else if(key == 38 && d != "DOWN"){
    d = "UP";
    up.play();
  }else if(key == 39 && d != "LEFT"){
    d = "RIGHT";
    right.play();
  }else if(key == 40 && d != "UP"){
    d = "DOWN";
    down.play();
  }
}

//check collision
function collision(head,array){
  for(let i = 0; i < array.length; i++)
  {
    if(head.x == array[i].x && head.y == array[i].y)
    {
      return true;
    }
  }
  return false;
}

// check collision of player and ai snakes
function snakeCollisions(playerHead, aiHead, playerSnake, aiSnake)
{
  for(let i = 0; i < playerSnake.length; i++)
  {
    if(aiHead.x == playerSnake[i].x && aiHead.y == playerSnake[i].y)
    {
      return true;
    }
  }

  for(let j = 0; j < aiSnake.length; j++)
  {
    if(playerHead.x == aiSnake[j].x && playerHead.y == aiSnake[j].y)
    {
      return true;
    }
  }

  return false;
}

//draw everything to the canvas
function draw(){
  
  ctx.drawImage(ground,0,0);

  // draw player snake
  for(let i = 0; i < snake.length; i++){
    ctx.fillStyle = (i == 0)? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = "green";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // draw ai snake
  for(let j = 0; j < aiSnake.length; j++){
    ctx.fillStyle = (j == 0)? "red" : "black";
    ctx.fillRect(aiSnake[j].x, aiSnake[j].y, box, box);

    ctx.strokeStyle = "red";
    ctx.strokeRect(aiSnake[j].x, aiSnake[j].y, box, box);
  }

  ctx.drawImage(foodImg, food.x, food.y);

  //current player head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  //current ai head position
  let aiHeadX = aiSnake[0].x;
  let aiHeadY = aiSnake[0].y;

  // call function to determine ai's next move here...
  // can either go up, down, left, or right
  // order each move by best move towards fruit
  let possibleMoves = [];

  let possibleMovesX = [];
  let sameAxisX = false;

  let possibleMovesY = [];
  let sameAxisY = false;
  
  if(aiHeadX - food.x > 0)
  {
    // snake is right of the fruit, left is good move
    possibleMovesX = ['LEFT',  'RIGHT'];
  }
  else if(aiHeadX - food.x < 0)
  {
    // snake is left of the fruit, right is a good move
    possibleMovesX = ['RIGHT', 'LEFT'];
  }
  else
  {
    // snake is on the same axis, don't move this way
    sameAxisX = true;
    possibleMovesX = ['LEFT',  'RIGHT']; // default in case moving in y direction doesnt work
  }

  if(aiHeadY - food.y > 0)
  {
    // snake is below the fruit, up is good move
    possibleMovesY = ['UP',  'DOWN'];
  }
  else if(aiHeadY - food.y < 0)
  {
    // snake is above the fruit, down is a good move
    possibleMovesY = ['DOWN', 'UP'];
  }
  else
  {
    // snake is on the same axis, don't move this way
    sameAxisY = true;
    possibleMovesY = ['UP',  'DOWN']; // default in case moving in x direction doesn't workb 
  }

  // one left move and one right move will always be good unless its already on the same axis
  // if on the same axis, move those moves to the end of the possible moves array
  // else we want the best move of x, then best move of y, then the rest (only good in case best moves would lead to a game-ending move)
  if(sameAxisX)
  {
    possibleMoves = possibleMovesY;
    
    possibleMoves.push(possibleMovesX[0]);
    possibleMoves.push(possibleMovesX[1]);
  }
  else if(sameAxisY)
  {
    possibleMoves = possibleMovesX;

    possibleMoves.push(possibleMovesY[0]);
    possibleMoves.push(possibleMovesY[1]);
  }
  else
  {
    // snake head was not on the same x or y axis as the fruit
    possibleMoves.push(possibleMovesX[0]);
    possibleMoves.push(possibleMovesY[0]);
    possibleMoves.push(possibleMovesX[1]);
    possibleMoves.push(possibleMovesY[1]);
  }


  //which direction player pressed
  if(d == "LEFT"){
    snakeX -= box;
  }if(d == "UP"){
    snakeY -= box;
  }if(d == "RIGHT"){
    snakeX += box;
  }if(d == "DOWN"){
    snakeY += box;
  }

  // determine move for ai snake
  let foundMove = false;
  let index = 0;
  let newAiHead;

  while((!foundMove) && (index < 4))
  {
    let newHeadX = aiHeadX;
    let newHeadY = aiHeadY;

    let move = possibleMoves[index];

    if(move == "LEFT"){
      newHeadX -= box;
    }if(move == "UP"){
      newHeadY -= box;
    }if(move == "RIGHT"){
      newHeadX += box;
    }if(move == "DOWN"){
      newHeadY += box;
    }

    newAiHead = {
      x : newHeadX,
      y : newHeadY
    }

    if( (!collision(newAiHead, aiSnake)) && (!collision(newAiHead, snake)) )
    {
        // no collision with itself or player snake
        if(newHeadX >= box && newHeadX <= 17 * box && newHeadY >= 3*box && newHeadY <= 17*box)
        {
          // no collision with out of bounds, this is the first move that works
          foundMove = true;
        }
    }

    index++;
  }
  
  if(!foundMove)
  {
    // there was no good move for the ai to make, it loses
    clearInterval(game);
    dead.play();

    resultSpan.style.display = "block";
    resultSpan.innerText = "You Win!";
    restartBtn.style.display = "block";
  }

  //if the snake eats the food
  if(snakeX == food.x && snakeY == food.y){
    score++;
    eat.play();
    spawnFood();
  }
  else{
    snake.pop(); //remove th tail
  }

  //if ai eats the food
  if(newAiHead.x == food.x && newAiHead.y == food.y){
    aiScore++;
    eat.play();
    spawnFood();
  }
  else{
    aiSnake.pop(); //remove th tail
  }

  //add new head
  let newHead = {
    x : snakeX,
    y : snakeY
  }

  //game over
  if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead, snake) || collision(newHead, aiSnake)){
    clearInterval(game);
    dead.play();

    resultSpan.style.display = "block";
    resultSpan.innerText = "You Lose!";
    restartBtn.style.display = "block";

  }

  snake.unshift(newHead);
  aiSnake.unshift(newAiHead);

  ctx.fillStyle = "white";
  ctx.font = "45px Arial";

  // draw player score
  ctx.fillText("You: " + score,2*box, 1.6*box);

  // draw upper right apple
  ctx.drawImage(foodImg, 13*box, .6*box);

  // draw ai score
  ctx.fillText("AI: " + aiScore, 14.3*box, 1.6*box)
  console.log("drawing frame");
}

//call draw function every 100 ms
// let game = setInterval(draw,100);

