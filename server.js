const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    const message = new Message({
      sender: msg.sender,
      receiver: msg.receiver,
      text: msg.text,
      timestamp: new Date()
    });
    message.save();
    io.emit('message', msg);
  });

socket.on('history', async (users) => {
  try {
    const messages = await Message.find({ 
    $or: [
      { sender: users.user1, receiver: users.user2 },
      { sender: users.user2, receiver: users.user1 }
      ]
       }).sort('timestamp').exec();
    io.emit('history', messages);
  } catch(err) {
    console.error(err);
  }
});

});

mongoose.connect('mongodb://localhost/chat_app', { useNewUrlParser: true });

app.use(express.static('.'));

server.listen(3000, function() {
  console.log('listening on *:3000');
});