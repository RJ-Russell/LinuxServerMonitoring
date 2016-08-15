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
  var currTime, cpuSpeed, cpuLoad, fullLoad, fsSize, mem, processes, ready = 0;
  if(clients <= 0) { return; }
  currTime = si.time().current;

  si.cpuCurrentspeed()
    .then(cpuSpeedData => {
      cpuSpeed = cpuSpeedData;
      ++ready;
      send();
    });

  si.currentLoad()
    .then(cpuLoadData => {
      cpuLoad = cpuLoadData;
      ++ready;
      send();
    });

  si.fullLoad()
    .then(cpuFullLoadData => {
      fullLoad = cpuFullLoadData;
      ++ready;
      send();
    });

  si.fsSize()
    .then(fsSizeData => {
      fsSize = fsSizeData;
      ++ready;
      send();
    });

  si.mem()
    .then(memData => {
      mem = memData;
      ++ready;
      send();
    });

  si.processes()
    .then(processesData => {
      processes = processesData;
      ++ready;
      send();
    });

  function send() {
    if(ready === 6) {
      io.emit('dynamic', {
        curr: currTime,
        uptime: si.time().uptime,
        cpuSpeedInfo: cpuSpeed,
        cpuLoadInfo: cpuLoad,
        cpuFullLoadInfo: fullLoad,
        memInfo: mem
      });
    }
  }

}, 1000);

io.on('disconnect', function() {
  --clients;
});
