// let express = require("express");
// let ws = require("ws");

// const app = express()
// const httpServer = app.listen(8080, ()=> {console.log("server listening on port 8080")});
// app.get("/", (req, res) => {
//     res.send("hi there");
// });

// const wss = new ws.Server({ server: httpServer });

// wss.on('connection', function connection(ws) {
//   ws.on('error', console.error);

//   ws.on('message', function message(data, isBinary) {
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === ws.OPEN) {
//         client.send("hi there, " + data, { binary: isBinary });
//       }
//     });
//   });

//   ws.send('Hello! Message From Server!!');
// });





// const canvas = document.getElementById("gameCanvas");
// const ctx = canvas.getContext("2d");

// // Constants
// const FPS = 60;
// const FLAPPY_BIRD_SIZE = 50;
// const GRAVITY = 0.2;  // Simulates "a" in your code
// const LIFT = -4;      // Simulates "u1" for upward motion
// const OBSTACLE_SPEED = 2;
// const WIN_X = 1100;

// // Bird properties
// let bird = { x: 200, y: 200, velocity: 0 };

// // Obstacle properties
// let topObstacles = [
//     { x: 300, y: 0, width: 50, height: 250 },
//     { x: 500, y: 0, width: 50, height: 250 },
//     { x: 800, y: 0, width: 50, height: 250 },
// ];

// let bottomObstacles = [
//     { x: 400, y: 400, width: 50, height: 200 },
//     { x: 600, y: 400, width: 50, height: 200 },
//     { x: 900, y: 400, width: 50, height: 200 },
// ];

// // Images
// const bg = new Image();
// bg.src = "../Media/bg.png";
// const flappyBirdImg = new Image();
// flappyBirdImg.src = "../Media/flappy2.png";
// const winDesign = new Image();
// winDesign.src = "../Media/win design.jpeg";
// const topObsImg = new Image();
// topObsImg.src = "../Media/obstacle_top.png";
// const bottomObsImg = new Image();
// bottomObsImg.src = "../Media/obstacle_bottom.png";

// // Draw function
// function draw() {
//     ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
//     ctx.drawImage(winDesign, WIN_X, 0, 1000, 505);

//     // Draw bird
//     ctx.drawImage(flappyBirdImg, bird.x, bird.y, FLAPPY_BIRD_SIZE, FLAPPY_BIRD_SIZE);

//     // Draw obstacles
//     topObstacles.forEach(obs => {
//         ctx.drawImage(topObsImg, obs.x, obs.y, obs.width, obs.height);
//     });
//     bottomObstacles.forEach(obs => {
//         ctx.drawImage(bottomObsImg, obs.x, obs.y, obs.width, obs.height);
//     });
// }

// // Update function
// function update() {
//     // Apply gravity
//     bird.velocity += GRAVITY;
//     bird.y += bird.velocity;

//     // Move obstacles
//     topObstacles.forEach(obs => (obs.x -= OBSTACLE_SPEED));
//     bottomObstacles.forEach(obs => (obs.x -= OBSTACLE_SPEED));
// }

// // Collision detection
// function checkCollision() {
//     const birdRect = { x: bird.x, y: bird.y, width: FLAPPY_BIRD_SIZE, height: FLAPPY_BIRD_SIZE };
//     for (const obs of [...topObstacles, ...bottomObstacles]) {
//         const obsRect = { x: obs.x, y: obs.y, width: obs.width, height: obs.height };
//         if (
//             birdRect.x < obsRect.x + obsRect.width &&
//             birdRect.x + birdRect.width > obsRect.x &&
//             birdRect.y < obsRect.y + obsRect.height &&
//             birdRect.y + birdRect.height > obsRect.y
//         ) {
//             return true; // Collision detected
//         }
//     }
//     return false;
// }

// // Game loop
// function gameLoop() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     update();
//     draw();

//     if (checkCollision()) {
//         console.log("Collision Detected!");
//         return; // End game
//     }

//     requestAnimationFrame(gameLoop);
// }

// // Input handling
// document.addEventListener("keydown", event => {
//     if (event.code === "Space") {
//         bird.velocity = LIFT; // Move up
//     }
// });

// // Start the game
// gameLoop();


let count = 0;
const intervalId = setInterval(() => {
  console.log("Interval count:", count++);
  if (count > 5) {
    // console.log(intervalId);
    // console.log(typeof intervalId);
    clearInterval(intervalId); // Stop the interval after 5 iterations
  }
}, 1000);



// count = 5;
// let result = count++;

// console.log(result); // Output: 5
// console.log(count); // Output: 6 

// console.log("--------------------------------");

// let count1 = 5;
// let result1 = ++count1;

// console.log(result1); // Output: 6
// console.log(count1); // Output: 6 