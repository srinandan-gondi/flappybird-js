// import { setupSocketListeners, joinRoom } from "./socketHelper.js";
const { setupSocketListeners, joinRoom } = require("./socketHelper.js");

setupSocketListeners();

const roomButton = document.getElementById("newIDbutton");

roomButton.addEventListener( "click",(e) => {
  
  
  makeId = () => {
    let ID = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for ( var i = 0; i < 12; i++ ) {
      ID += characters.charAt(Math.floor(Math.random() * 36));
    }
    return ID;
  }

  let newID = makeId();
  let newIDele = document.createElement("h4");
  newIDele.textContent = newID;
  const newIDdiv = document.getElementById("newIDdiv");
  newIDdiv.textContent = "";
  newIDdiv.appendChild(newIDele);

  joinRoom(newID);

})








const canvas = document.getElementById("gameCanvas");

canvas.width = screen.width;
canvas.height = (3 / 4) * screen.height;


const ctx = canvas.getContext("2d");

// Constants
const GRAVITY = 0.5;
const LIFT = -10;
const BIRD_SIZE = 50;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 250; // Increased gap between top and bottom obstacles
const OBSTACLE_SPACING = 300; // Minimum horizontal distance between obstacles
const OBSTACLE_OFFSET_VARIATION = 100; // Random horizontal offset for variety
const OBSTACLE_SPEED = 3;

// Game state
let bird = { x: 200, y: 200, velocity: 0 };
// let bird1 = { x: 260, y: 200, velocity: 0 };
let obstacles = [];
let score = 0;
let gameOver = false;
let firstTime = true;

// Images
const bg = new Image();
bg.src = "../Media/bg.png";
const birdImg = new Image();
birdImg.src = "../Media/flappy2.png";
const topObstacleImg = new Image();
topObstacleImg.src = "../Media/obstacle_top.png";
const bottomObstacleImg = new Image();
bottomObstacleImg.src = "../Media/obstacle_bottom.png";
const winDesign = new Image();
winDesign.src = "../Media/win design.jpeg";

// Helper functions
function createObstaclePair(x) {
  const topHeight = Math.random() * (canvas.height / 2); // Random height for top obstacle
  const bottomY = topHeight + OBSTACLE_GAP;
  return {
    top: { x: x, y: 0, width: OBSTACLE_WIDTH, height: topHeight },
    bottom: { x: x, y: bottomY, width: OBSTACLE_WIDTH, height: canvas.height - bottomY },
  };
}

function generateObstacles(initialX, count) {
  const generated = [];
  let currentX = initialX;

  for (let i = 0; i < count; i++) {
    generated.push(createObstaclePair(currentX));
    currentX += OBSTACLE_SPACING + Math.random() * OBSTACLE_OFFSET_VARIATION; // Controlled random spacing
  }

  return generated;
}

function resetGame() {
  bird = { x: 200, y: 200, velocity: 0 };
  obstacles = generateObstacles(canvas.width, 7); // Start with 3 obstacles
  score = 0;
  gameOver = false;
  firstTime = true;
  gameLoop();
}

// Initialize obstacles
obstacles = generateObstacles(canvas.width, 3); // Generate initial obstacles

// Input handling
document.addEventListener("keydown", event => {
  if (event.code === "Space" && !gameOver) {
    bird.velocity = LIFT; // Move bird up
  } 
  else if (gameOver && event.key === "Enter") {
    resetGame(); // Restart game on Enter
  }
});

// Game logic
function update() {
  if (gameOver) return;

  // Bird movement
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // Keep bird within canvas
  if (bird.y < 0) bird.y = 0;
  if (bird.y + BIRD_SIZE > canvas.height) {
    gameOver = true;
  }

  // Obstacle movement and collision detection
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    obs.top.x -= OBSTACLE_SPEED;
    obs.bottom.x -= OBSTACLE_SPEED;

    // Check if bird collides with obstacles
    if (
      (bird.x < obs.top.x + obs.top.width &&
        bird.x + BIRD_SIZE > obs.top.x &&
        bird.y < obs.top.y + obs.top.height) ||
      (bird.x < obs.bottom.x + obs.bottom.width &&
        bird.x + BIRD_SIZE > obs.bottom.x &&
        bird.y + BIRD_SIZE > obs.bottom.y)
    ) {
      gameOver = true;
    }

    // Increment score if bird passes obstacle
    if (obs.top.x + OBSTACLE_WIDTH < bird.x && !obs.passed) {
      score++;
      obs.passed = true;
    }
  }

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obs => obs.top.x + OBSTACLE_WIDTH > 0);

  // Add new obstacles if fewer than 3 on screen
  if (obstacles.length < 3) {
    const lastObstacle = obstacles[obstacles.length - 1];
    if (lastObstacle.top.x < canvas.width - OBSTACLE_SPACING) {
      obstacles.push(createObstaclePair(canvas.width));
    }
  }
}

// Rendering
function draw() {
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Draw bird
  ctx.drawImage(birdImg, bird.x, bird.y, BIRD_SIZE, BIRD_SIZE);

  // Draw obstacles
  for (const obs of obstacles) {
    ctx.drawImage(topObstacleImg, obs.top.x, obs.top.y, obs.top.width, obs.top.height);
    ctx.drawImage(bottomObstacleImg, obs.bottom.x, obs.bottom.y, obs.bottom.width, obs.bottom.height);
  }

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);

  // Draw game over
  if (gameOver || firstTime) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    // ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
    let filler = (gameOver ? "Game Over!" : "Click Enter to Start!")
    ctx.fillText(filler, canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    let fillerEnter = (gameOver ? "Press Enter to Restart" : "")
    ctx.fillText(fillerEnter, canvas.width / 2, canvas.height / 2);
  }
}

// Game loop
function gameLoop() {
  firstTime = false;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  

  update(); 
  draw();
  
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Start game
bg.onload = () => {
  draw();
  document.addEventListener("keydown", (event) => {
    if(event.key == "Enter" && firstTime){
      gameLoop();
    }
  })
  
};