'use strict';

var express = require('express');
var socketio = require('socket.io');
var os = require('os');

var server = express();
server.use('/', express.static(__dirname + '/'));
var io = socketio(server.listen(process.env.PORT || 8080));

io.on('connection', function() {
  io.emit('hostData', {
    hostname: os.hostname(),
    arch: os.arch(),
    type: os.type(),
    plat: os.platform(),
    rel: os.release(),
    user: os.userInfo()
  });

  setInterval(function() {
    io.emit('dynamicData', {
      cpu: os.cpus(),
      freemem: os.freemem(),
      load: os.loadavg(),
      net: os.networkInterfaces(),
      totalmem: os.totalmem(),
      uptime: os.uptime()
    });
  }, 1000);
});

