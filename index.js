(function() {
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

  socket.on('dynamic', function(dynamic) {
    // Current time and Uptime
    $('#currTime').html(formatCurrTime(dynamic.curr));
    $('#uptime').empty().html("Uptime: " + formatUptime(dynamic.uptime));

    // CPU Information
    $('#cpuLoad').html('Avg Load: ' + dynamic.cpuLoadInfo.avgload +
      ' Current Load: ' + dynamic.cpuLoadInfo.currentload +
      ' Full Load: ' + dynamic.cpuFullLoadInfo.fullload);

    $('#cpuSpeed').html('Min: ' + dynamic.cpuSpeedInfo.min +
      ' Avg: ' + dynamic.cpuSpeedInfo.avg + ' Max: ' + dynamic.cpuSpeedInfo.max
    );

    addToCpuSpeedChart(dynamic.curr, dynamic.cpuSpeedInfo.min,
      dynamic.cpuSpeedInfo.avg, dynamic.cpuSpeedInfo.max);

    // Memory Information
    $('#mem').html(
      'Total: ' + filesize(dynamic.memInfo.total) +
        ' free: ' + filesize(dynamic.memInfo.free) +
        ' used: ' + filesize(dynamic.memInfo.used) + ' active: ' + dynamic.memInfo.active +
        ' buffcache: ' + dynamic.memInfo.buffcache +
        ' available: ' + dynamic.memInfo.available +
        ' swaptotal: ' + dynamic.memInfo.swaptotal +
        ' swapused: ' + dynamic.memInfo.swapused +
        ' swapfree: ' + dynamic.memInfo.swapfree
    );
  });
})();
