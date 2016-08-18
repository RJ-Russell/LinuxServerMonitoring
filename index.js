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

    addToCpuLoadChart(dynamic.currTime, parseFloat(one),
      parseFloat(five), parseFloat(fteen));

    $('#spdMin').html('Min:<br>' + dynamic.cpuSpeed.min);
    $('#spdAvg').html('Avg:<br>' + dynamic.cpuSpeed.avg);
    $('#spdMax').html('Max:<br>' + dynamic.cpuSpeed.max);

    addToCpuSpeedChart(dynamic.currTime, dynamic.cpuSpeed.min,
      dynamic.cpuSpeed.avg, dynamic.cpuSpeed.max);

    // Memory Information
    $('#memTotal').html('Total Memory:<br>' + filesize(dynamic.mem.total));
    $('#memFree').html('Free Memory:<br>' + filesize(dynamic.mem.free));
    $('#memUsed').html('Used Memory:<br>' + filesize(dynamic.mem.used));
    updateMemGauge('#ram-container', dynamic.mem.total,
      dynamic.mem.free, dynamic.mem.used);

    $('#swapTotal').html('Swap Total:<br>' + filesize(dynamic.mem.swaptotal));
    $('#swapFree').html('Swap Free:<br>' + filesize(dynamic.mem.swapfree));
    $('#swapUsed').html('Swap Used:<br>' + filesize(dynamic.mem.swapused));
    updateMemGauge('#swap-container', dynamic.mem.swaptotal,
      dynamic.mem.swapfree, dynamic.mem.swapused);

    $('#cacheSize').html('Buffer Cache Size:<br>' + filesize(dynamic.mem.buffcache));
    $('#cacheAvail').html('Cache Mem. Available:<br>' + filesize(dynamic.mem.available));

    $('#fsSize').html(
        ' Use (%): ' + dynamic.fsSize[0].use
    );
    $('#fname').html('File System:<br>' + dynamic.fsSize[0].fs);
    $('#fmount').html('Mount Point:<br>' + dynamic.fsSize[0].mount);
    $('#fsize').html('Size:<br>' + filesize(dynamic.fsSize[0].size));
    $('#fused').html('Used:<br>' + filesize(dynamic.fsSize[0].used));
  });
});
