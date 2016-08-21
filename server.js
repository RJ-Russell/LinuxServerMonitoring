/**
 * Copyright (C) 2015 RJ Russell
 *
 * server.js: Keeps track of num clients, collects and sends static
 * and dynamic data to the client.
 *
 **/

'use strict';

var express = require('express');
var socketio = require('socket.io');
var osmod = require('os');
var si = require('systeminformation');

var server = express();
server.use('/', express.static(__dirname + '/'));
var io = socketio(server.listen(process.env.PORT || 8080));

// Collect the static data first.
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

// Send the static data when the server is connected to.
io.on('connection', function(socket) {
  ++clients;
  socket.emit('onConnection', {
    osInfo: os,
    cpuInfo: cpu,
    userInfo: userName,
    userLogin: userTime,
  });
});

// Colled and send the dynamic data.
(function heartbeat() {
  // Store each data element in an object.
  var dynamic = {}, ready = 0;

  // If no one is connected, don't send anything. Recheck every second.
	if (clients <= 0) {
		setTimeout(heartbeat, 1000);
		return;
	}

  dynamic['currTime'] = si.time().current;
  dynamic['uptime'] = si.time().uptime;

  dynamic['os'] = osmod.loadavg();

	si.cpuCurrentspeed().then(cpuSpeed => {
		dynamic['cpuSpeed'] = cpuSpeed;
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
    dynamic['proc'] = processes;
		send();
	});

  // Send the dynamic data.
  function send() {
    // If each promise has returned (there are 4), then send.
    // If not all the data is ready, return so the data can be collected.
		if (++ready < 4) { return; }

    io.emit('heartbeat', dynamic);
    // Set to emit every second.
		setTimeout(heartbeat, 1000);
	}
})();

// When client disconnects, decrease the client count.
io.on('disconnect', function() {
  --clients;
});
