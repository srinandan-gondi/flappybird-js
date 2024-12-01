// import { io } from "socket.io-client";
let io = require("socket.io-client");


const socket = io("http://localhost:8080");



function setupSocketListeners() {
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });
    
    // socket.on("connect_error", (err) => {
    //   console.log(`connect_error due to ${err.message}`);
    // });
    // socket.on('message', (data) => {
    //   console.log('Message from server:', data);
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

      }
    });

  }

function joinRoom(id) {
    socket.emit("create", id, (response) => {
        console.log("Status: ", response.status);
        console.log("Rooms: ", response.rooms);
    })
}  


module.exports = {
    setupSocketListeners,
    joinRoom
}