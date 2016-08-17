$(function() {
  var socket = io.connect('http://localhost:8080/');
  socket.on('onConnection', function(static) {
    $('#host').html(static.osInfo.hostname);
    if(static.userInfo != null) {
      $('#user').html(static.userInfo);
      if(static.userLogin != null) {
        $('#user').append(' logged in at ' + static.userLogin);
      }
    }
    $('#os').html(
      static.osInfo.platform +
        '<br>' + static.osInfo.distro + ' ' + static.osInfo.release +
        ' ' + static.osInfo.codename +
        '<br>' + static.osInfo.kernel + ' ' + static.osInfo.arch + ' ' +
        static.osInfo.logofile
    );
    $('#cpu').html(
      static.cpuInfo.manufacturer + ' ' + static.cpuInfo.brand +
        '<br>Speed: ' + static.cpuInfo.speed + ' GHz<br>Cores: ' +
        static.cpuInfo.cores
    );
  });

  socket.on('heartbeat', function(dynamic) {
    // Current time and Uptime
    $('#currTime').html(formatCurrTime(dynamic.currTime));
    $('#uptime').html('Uptime: ' + formatUptime(dynamic.uptime));
    $('#proc').html(
      'All: ' + dynamic.proc.all +
        ' Running: ' + dynamic.proc.running +
        ' Blocked: ' + dynamic.proc.blocked
    );
    // CPU Information
    var one = dynamic.os[0].toFixed(2);
    var five = dynamic.os[1].toFixed(2);
    var fteen = dynamic.os[2].toFixed(2);
    $('#one').html('1-Min: ' + one);
    $('#five').html('5 Min: ' + five);
    $('#fteen').html('15 Min: ' + fteen);

    addToCpuLoadChart(dynamic.currTime, parseFloat(one),
      parseFloat(five), parseFloat(fteen));

    $('#spdMin').html('Min: ' + dynamic.cpuSpeed.min);
    $('#spdAvg').html('Avg: ' + dynamic.cpuSpeed.avg);
    $('#spdMax').html('Max: ' + dynamic.cpuSpeed.max);

    addToCpuSpeedChart(dynamic.currTime, dynamic.cpuSpeed.min,
      dynamic.cpuSpeed.avg, dynamic.cpuSpeed.max);

    // Memory Information
    $('#mem').html(
      'Total: ' + filesize(dynamic.mem.total) +
        ' free: ' + filesize(dynamic.mem.free) +
        ' used: ' + filesize(dynamic.mem.used) +
        ' active: ' + filesize(dynamic.mem.active) +
        '<br> buffcache: ' + dynamic.mem.buffcache +
        ' available: ' + dynamic.mem.available +
        '<br> swaptotal: ' + dynamic.mem.swaptotal +
        ' swapused: ' + dynamic.mem.swapused +
        ' swapfree: ' + dynamic.mem.swapfree
    );

    $('#fsSize').html(
      'Name of File System: ' + dynamic.fsSize[0].fs +
        ' Size (Bytes): ' + dynamic.fsSize[0].size +
        ' Used (Bytes): ' + dynamic.fsSize[0].used +
        ' Use (%): ' + dynamic.fsSize[0].use +
        ' Mount Point: ' + dynamic.fsSize[0].mount
    );
  });
});
