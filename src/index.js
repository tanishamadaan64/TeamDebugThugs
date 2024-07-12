const http = require("http");
const express = require("express");
const path = require("path");
const socketio = require("socket.io");
var Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const port = 3000 || process.env.PORT;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage("Admin", "Welcome!"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", `${user.username} has joined!`)
      );

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }
    const user = getUser(socket.id);
    console.log("User", user);
    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  socket.on("location", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://www.google.com/maps?q=${coords.lat},${coords.long}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left!`)
      );
      io.to(user.room).emit("roomData",{
        room:user.room,
        users:getUsersInRoom(user.room)
      })
    }
  });
});
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

/* 
-When we use socket.emit we are emitting the event to a particular connection.
-If i used io.emit here every time a new client joined all clients would get the count.
-I want to emit it to every single connection. So I used io.emit 
-When we broadcast an event :We send it to everybody except the current client.
-Event Acknowledgements in socketio ,example use case sending a location or a message the client sends the 
the msg or the loc to the server but it's never quite sure the server recevied it and actually did 
something,with and ack the client would get notified that the message or the location was indeed delivered
successfully  
-socket.join allows us to join a given chat room we pass to it the name of the room
socket.join we have two new setups we'll be using for emitting messages 
 1- io.to.emit : emit an event to everybody in a specific room  without sending it to people in other rooms
 2- socket.broadcast.to.emit : send an event to everyone in a specific room except the current client 
-join room 
- 
*/
