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

var userName, userTime = 0;
si.users()
  .then(userData => {
    userName = userData[0].user;
    userTime = userData[0].time;
  });

io.on('connection', function(socket) {
  ++clients;
  socket.emit('onConnection', {
    osInfo: os,
    cpuInfo: cpu,
    userInfo: userName,
    userLogin: userTime,
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
