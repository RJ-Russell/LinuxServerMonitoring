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

var cpu, os = 0;
var clients = 0;
si.cpu()
  .then(cpuData => {
    cpu = cpuData;
  })

si.osInfo()
  .then(osData => {
    os = osData
  })

io.on('connection', function(socket) {
  ++clients;
  socket.emit('onConnection', {
    osInfo: os,
    cpuInfo: cpu
  });
});

setInterval(function() {
  io.emit('time', {
    curr: functionParseDate(si.time().current),
    uptime: functionTime(si.time().uptime)
  });
}, 1000);

io.on('disconnect', function() {
  --clients;
});

var functionTime = function(timeSeconds) {
  var date = new Date(timeSeconds * 1000);
  var h = date.getUTCHours();
  var m = date.getUTCMinutes();
  var s = date.getSeconds();

  if(h < 10) { h = "0"+h; }
  if(m < 10) { m = "0"+m; }
  if(s < 10) { s = "0"+s; }

  return h + ":" + m + ":" + s;
};

var functionParseDate = function(longEpoch) {
  var epochDate = moment(longEpoch);
  var strDate = epochDate.format("dddd, DD MMMM, YYYY HH:mm:ss");
  return strDate;
};
