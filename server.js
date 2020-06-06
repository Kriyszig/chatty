const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const httpServer = http.Server(app);
const io = socketio(httpServer);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
let clients = 0;

function disconnect() {
  if(clients > 0) {
    --clients;
  }
  // Don't interrupt the stream if a third user
  // leaves after seeing the error message
  if(clients < 2) {
    this.broadcast.emit('StopStream');
  }
}

function sendOffer(offer) {
  this.broadcast.emit('BackOffer', offer);
}

function sendAnswer(data) {
  this.broadcast.emit('BackAnswer', data);
}

function sendText(text) {
  this.broadcast.emit('TextMessage', text);
}

io.on('connection', function(socket) {
  socket.on('NewClient', function() {
    if(clients < 2) {
      if(clients == 1) {
        this.emit('CreatePeer');
      }
    } else {
      this.emit('SessionActive');
    }
    ++clients;
  });

  socket.on('Offer', sendOffer);
  socket.on('Answer', sendAnswer);
  socket.on('Text', sendText);
  socket.on('disconnect', disconnect);
});

httpServer.listen(PORT, () => console.log(`Active on http://localhost:${PORT}/`));
