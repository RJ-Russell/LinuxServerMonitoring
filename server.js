'use strict';

var express = require('express');
var socketio = require('socket.io');
var si = require('systeminformation');

var server = express();
server.use('/', express.static(__dirname + '/'));
var io = socketio(server.listen(process.env.PORT || 8080));

var cpu, os, user = 0;
var clients = 0;
si.cpu()
  .then(cpuData => {
    cpu = cpuData;
  });

si.osInfo()
  .then(osData => {
    os = osData
  });

si.users()
  .then(userData => {
    user = userData;
  });

io.on('connection', function(socket) {
  ++clients;
  socket.emit('onConnection', {
    osInfo: os,
    cpuInfo: cpu,
    userInfo: user[0].user,
    userLogin: user[0].time,
  });
});

setInterval(function() {
  io.emit('time', {
    curr: si.time().current,
    uptime: si.time().uptime,
  });

  si.cpuCurrentspeed()
    .then(cpuSpeedData => {
      io.emit('cpuSpeed', {
        cpuSpeedInfo: cpuSpeedData
      });
    });
}, 1000);

io.on('disconnect', function() {
  --clients;
});
