// Global Imports
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messagesHandler');
const {
  joinUser,
  getUser,
  userLeft,
  getUserRoom,
} = require('./utils/usersHandler');

// Global Variables
const PORT = process.env.PORT || 3000;

// Aplication Setup
const app = express();

// Create Server method
const server = http.createServer(app);

// Make variable IO and pass the server
const io = socketio(server);

// Run io when client connect
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = joinUser(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user that been connection
    // Send message into single client that connecting
    socket.emit('message', formatMessage('ChatBot', 'Welcome to Room Chat !'));

    // Broadcast when users connects
    // Broadcast messages into all clients except client that been connecting
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage('ChatBot', `${user.username} has join the chat !`)
      );

    // Send user and room information
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getUserRoom(user.room),
    });
  });

  // Listen from inputMessage
  socket.on('inputMessage', (inputMessage) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      'message',
      formatMessage(`${user.username}`, inputMessage)
    );
  });

  // Runs when client disconnect
  socket.on('disconnect', () => {
    const user = userLeft(socket.id);

    if (user) {
      // Broadcast into all client in general
      io.to(user.room).emit(
        'message',
        formatMessage('ChatBot', `${user.username} has left the chat !!`)
      );

      // Send user and room information
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getUserRoom(user.room),
      });
    }
  });
});

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Server Listen
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
