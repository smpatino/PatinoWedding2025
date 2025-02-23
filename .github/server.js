const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static('public'));

// Listen for socket connections
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('new message', (msg) => {
    console.log('message received:', msg);
    io.emit('new message', msg);  // Broadcast message to everyone
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
