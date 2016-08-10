'use strict';

var express = require('express');
var socketio = require('socket.io');
var os = require('os');

var server = express();
server.use('/', express.static(__dirname + '/'));
var io = socketio(server.listen(process.env.PORT || 8080));

io.on('connection', function() {
  io.emit('hostname', {
    hostname: os.hostname()
  });
});





server.listen('port');
