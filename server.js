'use strict';

var express = require('express');
var socketio = require('socket.io');
var os = require('os');
var si = require('systeminformation');

var server = express();
server.use('/', express.static(__dirname + '/'));
var io = socketio(server.listen(process.env.PORT || 8080));

si.getStaticData()
  .then(data => {
    console.log('STATIC DATA');
    console.log(data);
  });

si.getDynamicData()
  .then(data => {
    console.log();
    console.log('DYNAMNIC DATA');
    console.log(data);
  });

si.getAllData()
  .then(data => {
    console.log();
    console.log('ALL DATA');
    console.log(data);
  });

var sendError = function(event, error) {
  io.emit(event, {
    err: error
  });
}

io.on('connection', function() {
  io.emit('hostData', {
    hostname: os.hostname(),
    arch: os.arch(),
    type: os.type(),
    plat: os.platform(),
    rel: os.release(),
    user: os.userInfo()
  });

  si.cpu()
    .then(cpu => {
      io.emit('cpu', {
        man: cpu.manufacturer,
        brand: cpu.brand,
        speed: cpu.speed,
        cores: cpu.cores
      });
    })
    .catch(error => {
      sendError('cpu', error);
    });

  si.osInfo()
    .then(os => {
      io.emit('os', {
        plat: os.platform,
        distro: os.distro,
        release: os.release,
        cname: os.codename,
        kernel: os.kernel,
        arch: os.arch,
        host: os.hostname,
        lgfile: os.logofile
      });
    })
    .catch(error => {
      sendError('os', error);
    });

  setInterval(function() {
    //{
    //  freemem: os.freemem(),
    //  load: os.loadavg(),
    //  net: os.networkInterfaces(),
    //  totalmem: os.totalmem(),
    //  uptime: os.uptime()
    //});
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

