// import { setupSocketListeners, joinRoom } from "./socketHelper.js";
// const { setupSocketListeners, createRoom, joinRoom } = require("./socketHelper.js");

// setupSocketListeners();
// SETTING UP THE SOCKET SERVER

// const socket = require("socket.io-client")("http://localhost:8080", {
//   rejectUnauthorized: false
// });

const { response } = require("express");
const io = require("socket.io-client");


const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  withCredentials: true
});

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

// socket.on("connect_error", (err) => {
//   console.log(`connect_error due to ${err.message}`);
// });
// socket.on('message', (data) => {
//   console.log('Message from server:', data);
// });

// socket.on("connection_error", (err) => {
//   console.log(err.req);      // the request object
//   console.log(err.code);     // the error code, for example 1
//   console.log(err.message);  // the error message, for example "Session ID unknown"
//   console.log(err.context);  // some additional error context
// });


socket.on("connect_error", (error) => {
  if (socket.active) {
    console.log("hey there!!");
    console.log( "THIS IS THE ERROR: ", error.message);
    // temporary failure, the socket will automatically try to reconnect
  } else {
    // the connection was denied by the server
    // in that case, `socket.connect()` must be manually called in order to reconnect
    console.log( "THIS IS THE ERROR: ", error.message);
    // console.log(error);
    console.log(error.context);
    console.log(err.description);


  }
});
// ENDS HERE (NEEDS TO BE IN A WRAPPER FUNCTION)


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


let obstacles = [];
// let firstTime = true;

// Images
const bg = new Image();
bg.src = "../Media/bg.png";
const birdImg1 = new Image();
// birdImg.src = ("../Media/flappy2.png" ? !isSecondPlayer : "../Media/flappy3.png");
birdImg1.src = ("../Media/flappy2.png");

// initializing 2nd bird image
const birdImg2 = new Image();
birdImg2.src = ("../Media/flappy3.png");

const topObstacleImg = new Image();
topObstacleImg.src = "../Media/obstacle_top.png";
const bottomObstacleImg = new Image();
bottomObstacleImg.src = "../Media/obstacle_bottom.png";
const winDesign = new Image();
winDesign.src = "../Media/win design.jpeg";

let obsCount = 0;

// Helper functions
// function createObstaclePair(x) {
//   const topHeight = Math.random() * (canvas.height / 2); // Random height for top obstacle
//   const bottomY = topHeight + OBSTACLE_GAP;
//   obsCount++;
//   return {
//     top: { x: x, y: 0, width: OBSTACLE_WIDTH, height: topHeight },
//     bottom: { x: x, y: bottomY, width: OBSTACLE_WIDTH, height: canvas.height - bottomY },
//     passed: false
//   };
// }

// function generateObstacles(initialX, count) {
//   const generated = [];
//   let currentX = initialX;

//   for (let i = 0; i < count; i++) {
//     generated.push(createObstaclePair(currentX));
//     currentX += OBSTACLE_SPACING + Math.random() * OBSTACLE_OFFSET_VARIATION; // Controlled random spacing
//   }
  

//   return generated;
// }


function getObstacles(){
  socket.emit("get obstacles", canvas.width,(response) => {
      let obstacles = JSON.parse(response.obstacles);
  })
}


// Game state
let bird1 = { x: 200, y: 200, velocity: 0 , imgNum: 1};
// let bird = { x: 200, y: (500 ? isSecondPlayer : 200), velocity: 0 };

// Initialize obstacles
obstacles = generateObstacles(canvas.width, 15); // Generate initial obstacles

// CREATING A VARIABLE TO STORE THE COORDINATES OF BIRDS AND OBSTACLES
// (SINCE WE'RE USING RANDOM TO INITIALIZE THE OBSTACLES, WE NEED TO MAKE SURE THAT THEY ARE THE SAME FOR BOTH THE PLAYERS)
// NOW SEND THIS VARIABLE TO SERVER SO THAT SERVER CAN SEND IT TO OTHER USER
let outlook = {
    bird1: bird1,
    // bird2: { x: 200, y: 500, velocity: 0, imgNum: 2 },
    bird2: null,
    obstacles: obstacles,
    gameOver: false,
    score1: 0,
    score2: 0,
    winner: null
}

let winCoords = { x: outlook.obstacles[outlook.obstacles.length - 1].top.x + OBSTACLE_SPACING + 10, y: 0, width: 500 };






/*
  CREATE ROOM BUTTON
*/

let roomID = null;

const newRoomButton = document.getElementById("newIDbutton");

let isSecondPlayer = false;

newRoomButton.addEventListener( "click",(e) => {
  
  let makeId = () => {
    let ID = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for ( var i = 0; i < 12; i++ ) {
      ID += characters.charAt(Math.floor(Math.random() * 36));
    }
    return ID;
  }

  roomID = makeId();
  let newIDele = document.createElement("h4");
  newIDele.textContent = roomID;
  const newIDdiv = document.getElementById("newIDdiv");
  newIDdiv.textContent = "";
  newIDdiv.appendChild(newIDele);

  // createRoom(newID);
  // WRAP THIS CODE THE IN THE createRoom FUNCTION
  socket.emit("create", roomID, JSON.stringify(outlook), (response) => {
    console.log("Status: ", response.status);
    console.log("Rooms: ", response.rooms);
  })
  //
// WHAT OTHER EDGE CASES / FAILURES EXIST HERE?
})


/*
  JOIN ROOM BUTTON
*/
const joinRoomButton = document.getElementById("joinButton");

joinRoomButton.addEventListener("click", (e) => {
  const joinRoomID = document.getElementById("joinRoomID").value;
  
  // ADD LOGIC TO CHECK IF THE ID IS NULL HERE, USER CANT JUST CLICK ON SUBMIT WITHOUT ENTERING ANYTHING

  // CHECK IF THE ENTERED JOIN ID IS IN THE RIGHT FORMAT (NOT NULL, NOT SOME RANDOM STRING ENTERED BY USER BUT IS SOMETHING CREATED USING THE CREATE BUTTON)
  //WRAP THIS CODE IN THE joinRoom FUNCTION
  socket.emit("join", joinRoomID, (response) => {
    console.log("Response: ", response.message);
    
    if(response.message == "failure"){
      // return false;
      window.alert("failed to join room with specified ID");
      console.log("failed to join room with specified ID")
    }
    else{
      // send JSON.stringify(gameOutlook) in response object
      
      
      roomID = joinRoomID;      
      // console.log(outlook);
      // console.log(obstacles["obstacles"]);
      // console.log(typeof outlook["obstacles"]);

      isSecondPlayer = true;
      window.alert("successfully joined room with specified ID");
      console.log(response.message);
    }

  });
//
})


/*
  ON ANY CHANGE IN THE OTHER BIRD'S STATUS, CHANGE THE OUTLOOK OBJECT HERE
*/
socket.on("change", (gameOutlook, join) => {
  outlook = JSON.parse(gameOutlook);
  // firstTime = false;

  console.log("outlook: ", outlook);

  console.log("the change event here works!")
  if(join){
    
    console.log(join);
    
  }
  draw();
  if(outlook.winner){
    let filler = `Player ${outlook.winner} Wins!`;
    ctx.fillText(filler, canvas.width / 2 - 100, canvas.height / 2);
    outlook.gameOver = true;
  }
  
})


/*
  SEND CHANGES TO SERVER ON ANY CHANGES HERE
*/
function sendChanges(){
  socket.emit("change", roomID, JSON.stringify(outlook));
}
/*
  USER CLICKS SPACE TO MOVE BIRD UP AND DOWN
*/
document.addEventListener("keydown", event => {
  // && !firstTime
  if (event.code === "Space" && !outlook.gameOver) {
    // outlook.birds[0].velocity = LIFT;
    if (!isSecondPlayer) {
        outlook.bird1.velocity = LIFT;
    } else {
        outlook.bird2.velocity = LIFT;
    }
    // bird.velocity = LIFT;
    sendChanges();
    // bird.velocity = LIFT; // Move bird up
  } 
  else if (outlook.gameOver && event.key === "Enter") {   // I THINK WE SHOULD ONLY CHECK THE GAME OVER VARIABLE HERE
    resetGame(); // Restart game on Enter
    
  }
});


/*
  RESET GAME WHEN gameOver = true
*/
function resetGame() {
  // bird = { x: 200, y: (500 ? isSecondPlayer : 200), velocity: 0 };
  // outlook = {birds: [bird1], obstacles: obstacles}

  // socket.emit("reset", outlook, isSecondPlayer, (response) => {
  //   outlook = response.gameOutlook;
  // })
  obstacles = generateObstacles(canvas.width, 15); // Reset obstacles
  
  // console.log(outlook.bird2);
  outlook = {
    bird1: { x: 200, y: 200, velocity: 0 , imgNum: 1},
    // bird2: { x: 200, y: 500, velocity: 0, imgNum: 2 },
    bird2: (outlook.bird2 ? { x: 200, y: 500, velocity: 0, imgNum: 2} : null),
    obstacles: obstacles,
    gameOver: false,
    score1: 0,
    score2: 0
  }

  winCoords = { x: outlook["obstacles"][outlook["obstacles"].length - 1].top.x + OBSTACLE_SPACING + 10, y: 0, width: 500 }
  // outlook = JSON.stringify(outlook)

  sendChanges();
  gameLoop();
}


let keys = ["bird1", "bird2"];

// Game logic
function update() {
  


  // Bird movement

  for(let obs of outlook["obstacles"]){
    obs.top.x -= OBSTACLE_SPEED;
    obs.bottom.x -= OBSTACLE_SPEED;
  }

  winCoords.x -= OBSTACLE_SPEED;

  for (let bird of keys) {
    
    
    if(outlook[bird]){
      // let temp = ;
      // console.log(outlook[bird]);  
      
      outlook[bird].velocity += GRAVITY;
      outlook[bird].y += outlook[bird].velocity;

      // Keep bird within canvas
      if (outlook[bird].y < 0) outlook[bird].y = 0;
      if (outlook[bird].y + BIRD_SIZE > canvas.height) {
        outlook.gameOver = true;
        sendChanges();
      }
      
      // let obsLength = 15;  
      // let i = 0; i < obsLength; i++

      console.log("obstacles object type: ", typeof outlook.obstacles)

      for (let obs of outlook["obstacles"]) {
        
        
        // Check if bird collides with obstacles
        if (
          (outlook[bird].x < obs.top.x + obs.top.width &&
            outlook[bird].x + BIRD_SIZE > obs.top.x &&
            outlook[bird].y < obs.top.y + obs.top.height) ||
          (outlook[bird].x < obs.bottom.x + obs.bottom.width &&
            outlook[bird].x + BIRD_SIZE > obs.bottom.x &&
            outlook[bird].y + BIRD_SIZE > obs.bottom.y)
        ) {
          outlook.gameOver = true;
          sendChanges();
        }
    
        // Increment score if bird passes obstacle
        if (obs.top.x + OBSTACLE_WIDTH < outlook[bird].x && !obs.passed) {
          if(isSecondPlayer){outlook.score2++}
          else{outlook.score1++} 
          obs.passed = true;
          sendChanges();
        }
      }

      // Remove off-screen obstacles
      outlook["obstacles"] = outlook["obstacles"].filter(obs => obs.top.x + OBSTACLE_WIDTH > 0);
      
      // if(outlook["obstacles"].length == 1){
      //   winCoords = { x: outlook.obstacles[outlook.obstacles.length - 1].x + OBSTACLE_SPACING + 10, width: 100 };
      // }
      
      sendChanges();

    }
    
  }

  // bird.velocity += GRAVITY;
  // bird.y += bird.velocity;

  // // Keep bird within canvas
  // if (bird.y < 0) bird.y = 0;
  // if (bird.y + BIRD_SIZE > canvas.height) {
  //   gameOver = true;
  // }

  // // Obstacle movement and collision detection
  // for (let i = 0; i < obstacles.length; i++) {
  //   const obs = obstacles[i];
  //   obs.top.x -= OBSTACLE_SPEED;
  //   obs.bottom.x -= OBSTACLE_SPEED;

  //   // Check if bird collides with obstacles
  //   if (
  //     (bird.x < obs.top.x + obs.top.width &&
  //       bird.x + BIRD_SIZE > obs.top.x &&
  //       bird.y < obs.top.y + obs.top.height) ||
  //     (bird.x < obs.bottom.x + obs.bottom.width &&
  //       bird.x + BIRD_SIZE > obs.bottom.x &&
  //       bird.y + BIRD_SIZE > obs.bottom.y)
  //   ) {
  //     gameOver = true;
  //     return;
  //   }

  //   // Increment score if bird passes obstacle
  //   if (obs.top.x + OBSTACLE_WIDTH < bird.x && !obs.passed) {
  //     score++;
  //     obs.passed = true; // why do we need this?
  //   }
  // }

  // obstacles = obstacles.filter(obs => obs.top.x + OBSTACLE_WIDTH > 0);
  // if (obstacles.length < 3) {
  //   const lastObstacle = obstacles[obstacles.length - 1];
  //   if (lastObstacle.top.x < canvas.width - OBSTACLE_SPACING && obsCount < 15) {
  //     obstacles.push(createObstaclePair(canvas.width));
  //     obsCount++;
  //   }
  // }
  // Remove off-screen obstacles
  // outlook.obstacles = outlook.obstacles.filter(obs => obs.top.x + OBSTACLE_WIDTH > 0);

  // // Add new obstacles if fewer than 3 on screen
  // if (outlook.obstacles.length < 3) {
  //   const lastObstacle = outlook.obstacles[outlook.obstacles.length - 1];
  //   if (lastObstacle.top.x < canvas.width - OBSTACLE_SPACING && obsCount < 15) {
  //     outlook.obstacles.push(createObstaclePair(canvas.width));
  //     obsCount++;
  //   }
  //   if (obsCount == 15){
  //     ctx.drawImage(winDesign, 0, 0, canvas.width, canvas.height);
  //     gameOver = true;
  //   }
}

// Rendering
function draw() {
  
  
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  
  // let temp = ;
  ctx.drawImage(birdImg1, outlook["bird1"]["x"], outlook["bird1"]["y"], BIRD_SIZE, BIRD_SIZE);

  if(outlook["bird2"]){
    // temp = ;
    ctx.drawImage(birdImg2, outlook["bird2"]["x"], outlook["bird2"]["y"], BIRD_SIZE, BIRD_SIZE); 
  }

  // ctx.drawImage(birdImg1, bird.x, bird.y, BIRD_SIZE, BIRD_SIZE)

  for(bird of keys){
      // Check if a bird has crossed the finished line
      if(outlook[bird]){
        if (winCoords["x"] < outlook[bird]["x"] + BIRD_SIZE/2) {
          if(bird == "bird2"){
            filler = "Player 2 Wins!";
            ctx.fillText(filler, canvas.width / 2 - 100, canvas.height / 2);
            outlook.winner = 2;
          }
          else{
            filler = "Player 1 Wins!";
            ctx.fillText(filler, canvas.width / 2 - 100, canvas.height / 2);
            outlook.winner = 1;
          }
          sendChanges();
          outlook.gameOver = true; 
          
        }
      }
      
  }
  

  // for (const obs of outlook.obstacles) {
  // Draw obstacles
  for (const obs of outlook.obstacles) {
    ctx.drawImage(topObstacleImg, obs.top.x, obs.top.y, obs.top.width, obs.top.height);
    ctx.drawImage(bottomObstacleImg, obs.bottom.x, obs.bottom.y, obs.bottom.width, obs.bottom.height);
  }

  ctx.drawImage(winDesign, winCoords.x, 0, winCoords.width, canvas.height);

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(( !isSecondPlayer ? `Score: ${outlook.score1}` : `Score 1: ${outlook.score1}\nScore 2: ${outlook.score2}`), 10, 20);

  // || firstTime
  // Draw game over
  if ((outlook.gameOver) && !outlook.winner) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    // ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
    let filler = (outlook.gameOver ? "Game Over!" : "Click Enter to Start!")
    ctx.fillText(filler, canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    let fillerEnter = (outlook.gameOver ? "Press Enter to Restart" : "")
    ctx.fillText(fillerEnter, canvas.width / 2, canvas.height / 3);
  }
}

// Game loop
function gameLoop() {
  // firstTime = false;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update(); 
  draw();
  
  if (!outlook.gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Start game
bg.onload = () => {
  draw();
  document.addEventListener("keydown", (event) => {
    //  && firstTime
    if(event.key == "Enter"){
      gameLoop();
    }
  })
  
  }

bg.onerror = (err) => {
  console.log(err);
}  

// };