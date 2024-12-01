const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
// import path from "path";

const app = express();
app.use(cors({
    origin: '*'
}));
// app.use('/modules', express.static(path.join(__dirname, '../node_modules')));


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "http://127.0.0.1:5500"
    }
  });
const room = "flappy";



app.get("/", (req, res) => {
    res.send(`<h1>Hi There!</h1>`);
})

io.use((socket, next) => {
    const err = new Error("not authorized");
    err.data = { content: "Please retry later" }; // additional details
    next(err);
  });


io.on("connection", async (socket) => {
    console.log("a user connected");

    socket.emit("i am god.", "ohooo");
    io.emit("i am god.", "ohooo");

    socket.on("chat message", (message) => {
        // console.log("message: ", message);
        io.emit("chat message", message);
    })
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    
    socket.on("create", (roomID,  callback) => {
        socket.join(roomID);
        callback({
            status: "success",
            rooms: io.of("/").adapter.rooms
        });
    });  
    
    // how do i get the user ID on the client side so that I can send it here?
    socket.on("join", (room) => {
        if(io.sockets.adapter.rooms.get(room).size == 2){
            socket.emit("error", "2 users already in room, couldn't join.");
        }
        else{
            socket.join(room);    
            console.log(`successfully joined room ${room}`);
        }
        
        
    })
    // await socket.join(room);
});


httpServer.listen(8080, () => {console.log("server listening on port 8080")});