/**
 * Copyright (C) 2015 RJ Russell
 *
 * index.js: contains the main client side logic. Handles data sent from the
 * server, and handles updating graphs with any new data received.
 *
 **/

$(function() {
  var socket = io.connect('http://localhost:8080/');

  // When connected, receive the static data and put where it needs to be.
  socket.on('onConnection', function(static) {
    $('#host').html(static.osInfo.hostname);
    // If user is not null, display the username.
    if(static.userInfo != null) {
      $('#user').html(static.userInfo);
      // If the time the user logged in is not null,
      // append to the username.
      if(static.userLogin != null) {
        $('#user').append(' logged in at ' + static.userLogin);
      }
    }

    // OS info.
    $('#sys-os').html(
      static.osInfo.platform +
        '<br>' + static.osInfo.distro + ' ' + static.osInfo.release +
        ' ' + static.osInfo.codename +
        '<br>' + static.osInfo.kernel + ' ' + static.osInfo.arch + ' ' +
        static.osInfo.logofile
    );
    // CPU info.
    $('#sys-cpu').html(
      static.cpuInfo.manufacturer + ' ' + static.cpuInfo.brand +
        '<br>Speed: ' + static.cpuInfo.speed + ' GHz<br>Cores: ' +
        static.cpuInfo.cores
    );
  });

  // Dynamic data. Updates on an interval set in server.js
  socket.on('heartbeat', function(dynamic) {
    // Current time and uptime
    $('#currTime').html(formatCurrTime(dynamic.currTime));
    $('#uptime').html('Uptime:<br>' + formatUptime(dynamic.uptime));
    $('#proc').html(
      'All: ' + dynamic.proc.all +
        ' Running: ' + dynamic.proc.running +
        ' Blocked: ' + dynamic.proc.blocked
    );

    // CPU Information
    var one = dynamic.os[0].toFixed(2);
    var five = dynamic.os[1].toFixed(2);
    var fteen = dynamic.os[2].toFixed(2);
    $('#one').html('1-Min:<br>' + one);
    $('#five').html('5 Min:<br>' + five);
    $('#fteen').html('15 Min:<br>' + fteen);
    // Dynamically add data to the cpu load chart.
    addToCpuLoadChart(dynamic.currTime, parseFloat(one),
      parseFloat(five), parseFloat(fteen));

    $('#spdMin').html('Min:<br>' + dynamic.cpuSpeed.min);
    $('#spdAvg').html('Avg:<br>' + dynamic.cpuSpeed.avg);
    $('#spdMax').html('Max:<br>' + dynamic.cpuSpeed.max);
    // dynamically add data to the cpu speed chart.
    addToCpuSpeedChart(dynamic.currTime, dynamic.cpuSpeed.min,
      dynamic.cpuSpeed.avg, dynamic.cpuSpeed.max);

    // Memory Information
    $('#memTotal').html('Total Memory:<br>' + filesize(dynamic.mem.total));
    $('#memFree').html('Free Memory:<br>' + filesize(dynamic.mem.free));
    $('#memUsed').html('Used Memory:<br>' + filesize(dynamic.mem.used));
    // dynamically add data to the RAM gauge.
    updateMemGauge('#ram-container', dynamic.mem.total,
      dynamic.mem.free, dynamic.mem.used);

    $('#swapTotal').html('Swap Total:<br>' + filesize(dynamic.mem.swaptotal));
    $('#swapFree').html('Swap Free:<br>' + filesize(dynamic.mem.swapfree));
    $('#swapUsed').html('Swap Used:<br>' + filesize(dynamic.mem.swapused));
    // dynamically add data to the swap mem gauge.
    updateMemGauge('#swap-container', dynamic.mem.swaptotal,
      dynamic.mem.swapfree, dynamic.mem.swapused);

    // File data.
    $('#fname').html('File System:<br>' + dynamic.fsSize[0].fs);
    $('#fmount').html('Mount Point:<br>' + dynamic.fsSize[0].mount);
    $('#fsize').html('Size:<br>' + filesize(dynamic.fsSize[0].size));
    $('#ffree').html('Free:<br>' + filesize(dynamic.fsSize[0].size - dynamic.fsSize[0].used));
    updateDiskPie(dynamic.fsSize[0].use);
  });
});

// Format the uptime field.
var formatUptime = function(timeSeconds) {
  return moment.preciseDiff(0, timeSeconds*1000);
};

// Format the current time.
var formatCurrTime = function(longEpoch) {
  var epochDate = moment(longEpoch);
  var strDate = epochDate.format(" HH:mm:ss dddd, DD MMMM, YYYY");
  return strDate;
};

