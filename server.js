'use strict';

var express = require('express');
var socketio = require('socket.io');
var os = require('os');
var si = require('systeminformation');
var moment = require('moment');

var server = express();
server.use('/', express.static(__dirname + '/'));
var io = socketio(server.listen(process.env.PORT || 8080));

//si.getStaticData()
//  .then(data => {
//    console.log('STATIC DATA');
//    console.log(data);
//  });
//
//si.getDynamicData()
//  .then(data => {
//    console.log();
//    console.log('DYNAMNIC DATA');
//    console.log(data);
//  });
//
//si.getAllData()
//  .then(data => {
//    console.log();
//    console.log('ALL DATA');
//    console.log(data);
//  });

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

}, 1000);

io.on('disconnect', function() {
  --clients;
});
