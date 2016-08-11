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
  
  var uptime = os.uptime()
  setInterval(function() {
    io.emit('dynamicData', {
      cpu: os.cpus(),
      freemem: os.freemem(),
      load: os.loadavg(),
      net: os.networkInterfaces(),
      totalmem: os.totalmem(),
      uptime: time(os.uptime())
    });
  }, 1000);
});

var time = function(timeSeconds) {
  var date = new Date(timeSeconds * 1000);
  var h = date.getUTCHours();
  var m = date.getUTCMinutes();
  var s = date.getSeconds();

  if(h < 10) { h = "0"+h; }
  if(m < 10) { m = "0"+m; }
  if(s < 10) { s = "0"+s; }

  return h + ":" + m + ":" + s;
};

