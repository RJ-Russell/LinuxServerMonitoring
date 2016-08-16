'use strict';

var express = require('express');
var socketio = require('socket.io');
var si = require('systeminformation');
var async = require('async');

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

(function heartbeat() {
	var dynamic = {}, ready = 0;

	if (clients <= 0) {
		setTimeout(heartbeat, 1000);
		return;
	}

  dynamic['currTime'] = si.time().current;
  dynamic['uptime'] = si.time().uptime;

	si.currentLoad().then(cpuLoad => {
		dynamic['cpuLoad'] = cpuLoad;
		send();
	});

	si.cpuCurrentspeed().then(cpuSpeed => {
		dynamic['cpuSpeed'] = cpuSpeed;
		send();
	});

	si.fullLoad().then(cpuFullLoad => {
		dynamic['fullLoad'] = cpuFullLoad;
		send();
	});

	si.mem().then(mem => {
		dynamic['mem'] = mem;
		send();
	});

	si.fsSize().then(fsSize => {
		dynamic['fsSize'] = fsSize;
		send();
	});

	si.processes().then(processes => {
		dynamic['processes'] = processes;
		send();
	});

	function send() {
		if (++ready < 6) { return; }

		io.emit('heartbeat', dynamic);
		setTimeout(heartbeat, 1000);
	}
})();

io.on('disconnect', function() {
  --clients;
});
