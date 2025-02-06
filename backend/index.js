const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
// import path from "path";
const ObstaclePair = require("./obstacle");
const Bird = require("./bird");

const app = express();
app.use(cors({
    origin: '*'
}));
// app.use('/modules', express.static(path.join(__dirname, '../node_modules')));


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "http://127.0.0.1:5500/",
      methods: ["GET", "POST"]
    }
  });

//TEST TEST  
app.get("/", (req, res) => {
    res.send(`<h1>Hi There!</h1>`);
})

// io.use((socket, next) => {
//     const err = new Error("not authorized");
//     err.data = { content: "Please retry later" }; // additional details
//     next(err);
//   });

// let gameOutlook = {};

const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 250; // Increased gap between top and bottom obstacles
const OBSTACLE_SPACING = 300; // Minimum horizontal distance between obstacles
const OBSTACLE_OFFSET_VARIATION = 100; // Random horizontal offset for variety
const OBSTACLE_SPEED = 3;


let obsCount = 0;

function createObstaclePair(x) {
    const topHeight = Math.random() * (canvas.height / 2); // Random height for top obstacle
    const bottomY = topHeight + OBSTACLE_GAP;
    obsCount++;
    
    let obstaclePair = new ObstaclePair(x, 0, OBSTACLE_WIDTH, topHeight, 
                                         x, bottomY, OBSTACLE_WIDTH, canvas.height - bottomY,
                                         false);
    return obstaclePair;
}
  
function generateObstacles(initialX, count) {
    const generated = [];
    let currentX = initialX;
  
    for (let i = 0; i < count; i++) {
      generated.push(createObstaclePair(currentX));
      currentX += OBSTACLE_SPACING + Math.random() * OBSTACLE_OFFSET_VARIATION; // Controlled random spacing
    }
    
    let winDesign = new ObstaclePair(generated.length-1 + OBSTACLE_SPACING + 10, 0, 500);

    return {generated, winDesign};
}

const FRAME_TIME = Math.floor(1000 / 25);


let obstacles;
socket.on("get obstacles", (width) => {
    obstacles = generateObstacles(width/2, 15);
})


let outlook;

// let outlook = {obstacles, winDesign};
outlook.obstacles = obstacles;
outlook.winDesign = winDesign;

setInterval(function() {
   
    socket.emit("sendChanges", JSON.stringify(outlook));     
   
    for(let obs of obstacles){
        obs.xt -= OBSTACLE_SPEED;
        obs.xb -= OBSTACLE_SPEED;
   }
   winDesign.xt -= OBSTACLE_SPEED;
   
   outlook = {obstacles, winDesign}; 

}, FRAME_TIME);

socket.on("sendChanges")




io.on("connection", async (socket) => {
    console.log("a user connected");

    
    
    if(outlook.length === )
    let bird = new Bird(200, 200, 1, 0);
    outlook[socket.id] = bird;

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit("disconnect-message", "Other player is having connection issues. Ending game now.")
        outlook = {};
      });

    
    socket.on("create", (roomID, outlook, callback) => {
        // check later if this user is already in another room. If so, send them failure to join new room message
        socket.join(roomID);
        gameOutlook = JSON.parse(outlook);
        callback({
            status: "success",
            rooms: io.of("/").adapter.rooms.values()
        });
    });  
    
    // how do i get the user ID on the client side so that I can send it here?
    socket.on("join", (roomID, callback) => {
        if(!roomID || io.sockets.adapter.rooms.get(roomID).size != 1){
            callback({
                message: "failure"
            });
            // socket.emit("error", "2 users already in room, couldn't join.");
        }
        else{
            socket.join(roomID);
            // gameOutlook.birds.push({ x: 200, y: 500, velocity: 0 , imgNum: 2});
            gameOutlook["bird2"] = { x: 200, y: 500, velocity: 0, imgNum: 2};

            console.log("gameOutlook object on the SERVER side: ", gameOutlook)

            // gameOutlook = JSON.stringify(gameOutlook);
            socket.emit("change", JSON.stringify(gameOutlook), true);
            callback({
                message: `successfully joined room ${roomID}`,
                roomID: roomID
            });
            
            // console.log(`successfully joined room ${roomID}`);
        }
        
        
    })
    

  socket.on("change", (roomID, outlook) => {
     // PROBLEM HERE IS, I CANT BROADCAST IT TO USERS OTHER THAN SENDER IN A PARTICULAR ROOM
    gameOutlook = outlook;
    socket.broadcast.to(roomID).emit("change", JSON.stringify(gameOutlook));
  })  

  socket.on("reset", (outlook, isSecondPlayer, callback) => {
    if (isSecondPlayer) {
        gameOutlook = outlook.birds.push({ x: 200, y: 500, velocity: 0 , imgNum: 2});
    }
    else{
        gameOutlook = outlook;
    }
    
    callback({
        gameOutlook: gameOutlook
    })
    
    // socket.emit(gameOutlook);
  })

  
//   socket.emit("initialize bird", JSON.stringify(bird));


});




httpServer.listen(8080, () => {console.log("server listening on port 8080")});