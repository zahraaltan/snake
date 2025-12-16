const board = document.querySelector(".board");
const boardwidth = 50;
const boardheight = 50;


const cols = Math.floor(board.clientWidth / boardwidth);
const rows = Math.floor(board.clientHeight / boardheight);

const highscoreElement = document.querySelector("#hscore") 
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")
let finalScoreElement = document.getElementById("fScore")


let highscore = localStorage.getItem("highscore") || 0;
let score = 0;
let time = '00:00';

 
let intervalId = null;
let timerintervalId = null;

let food = {x:Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)}

const start = document.querySelector(".start")
const restart = document.querySelector(".restart")
const btnstart = document.querySelector(".btn-start")
const gameover = document.querySelector(".gameover")
const modal = document.querySelector(".modal")
const restartbtn = document.querySelector(".restrt")

//yeah ho gya time wala logic
btnstart.addEventListener("click",()=>{
  intervalId = setInterval(() => {
    render()
  }, 300);
  modal.style.display = "none";
  timerintervalId = setInterval(() => {
   let [min,sec] = time.split(":").map(Number);
   if(sec==59){
    min+=1;
    sec=0;
   }else{
    sec +=1
   }
   time = `${min}:${sec < 10 ? '0' : ''}${sec}`
   timeElement.innerHTML = time
  },1000);
})
  

const blocks = [];
let snake = [{x:1,y:4}]

let direction = 'down';
  for(let row=0;row<rows;row++){
    for(let col=0; col<cols; col++){
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block)
        blocks[`${row}-${col}`] = block;
    }
  }


function render() {
  let head = null;

  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction == "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction == "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction == "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction == "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }
//yeah ho gya wo logic jab gameover ho ga tou chalay ga
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    clearInterval(timerintervalId)
    modal.style.display = "flex";
    start.style.display = "none"
    gameover.style.display = "block"
    restart.style.display = "none"
    finalScoreElement.textContent = score;
    return;
  }

  snake.forEach(segment => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
//yeah khana khanay wala logic snake ka
  let ateFood = false;
  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    }
    ateFood = true;
    score+=1;
    scoreElement.innerHTML = score;
    if(score>highscore){
      highscore = score;
     localStorage.setItem("highscore",highscore.toString())
     highscoreElement.innerHTML = highscore;
    }
  }

  snake.unshift(head);
  
  if (!ateFood) {
    snake.pop();
  }

  snake.forEach(segment => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
  
  blocks[`${food.x}-${food.y}`].classList.add("food");
}
function restartGame() {
  // Clear existing intervals
  clearInterval(intervalId);
  clearInterval(timerintervalId);

  // Remove snake and food from board (with safety checks)
  snake.forEach(segment => {
    const blockKey = `${segment.x}-${segment.y}`;
    if (blocks[blockKey]) {
      blocks[blockKey].classList.remove("fill");
    }
  });
  
  if (blocks[`${food.x}-${food.y}`]) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
  }
  
  // Reset game state
  time = '00:00';
  score = 0;
  scoreElement.innerHTML = score;
  // Update displays
  scoreElement.innerHTML = score;
  timeElement.innerHTML = time;
  
  // Get fresh highscore from localStorage
  highscore = parseInt(localStorage.getItem("highscore") || 0);
  highscoreElement.innerHTML = highscore;
  
  // Hide modal if shown
  modal.style.display = "none";
  
  // Reset game variables
  direction = 'down';
  
  // Set snake to a safe starting position (center of board)
  snake = [{
    x: Math.floor(rows / 2),
    y: Math.floor(cols / 2)
  }];
  
  // Generate food that's not on the snake
  do {
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols)
    };
  } while (snake.some(segment => 
    segment.x === food.x && segment.y === food.y
  ));
  
  // Restart game loop
  intervalId = setInterval(() => {
    render();
  }, 300);
  
  // Restart timer
  timerintervalId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);
    
    if (sec === 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    
    // Pad with leading zeros
    time = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
    timeElement.innerHTML = time;
  }, 1000);
}

restartbtn.addEventListener("click", restartGame);
addEventListener("keydown",(event)=>{
  if(event.key === "ArrowLeft"){
    direction = "left"
  }else if(event.key === "ArrowRight"){
    direction = "right"
  }else if(event.key === "ArrowUp"){
    direction = "up"
  }else if(event.key === "ArrowDown"){
    direction = "down"
  }else{

  }
})

//preventing snake to enter in itself
addEventListener("keydown",(event)=>{
  if(event.key === "ArrowLeft" && direction !== "right"){
    direction = "left"
  }else if(event.key === "ArrowRight" && direction !== "left"){
    direction = "right"
  }else if(event.key === "ArrowUp" && direction !== "down"){
    direction = "up"
  }else if(event.key === "ArrowDown" && direction !== "up"){
    direction = "down"
  }
})