var initialData = function() {
  // generate some points to render before real samples arrive from feed
  var data = [],
    time = (new Date()).getTime(),
    i;
  // 20 samples, starting 19 ms ago up to present time when feed starts plotting
  for (i = -19; i <= 0; i++) {
    data.push({
      x: time + (i * 1000),
      y: 0
    });
  }
  return data;
};


Highcharts.setOptions({
  global: {
    useUTC: false
  }
});

$('#cpu-container').highcharts({
  chart: {
    type: 'spline',
    events: {
      load: function() {
        var chart = $('#cpu-container').highcharts();
        var series1 = chart.get('cpuAvg');
        var series2 = chart.get('cpuMin');
        var series3 = chart.get('cpuMax');
        var socket = io.connect('http://localhost:8080');
        socket.on('cpu', function (cpu) {
          $('#cpuSpeed').html(
            'CPU Speed<br>Min: ' + cpu.y + ' Avg: ' + cpu.y1 + ' Max: ' + cpu.y2
          );
          // when a sample arrives we plot it
          series1.addPoint([cpu.x, cpu.y], false, true);
          series2.addPoint([cpu.x, cpu.y1], false, true);
          series3.addPoint([cpu.x, cpu.y2], true, true);
        });
      }
    }
  },
  title: { text: '' },
  xAxis: {
    type: 'datetime',
    tickPixelInterval: 100
  },
  yAxis: {
    title: { text: 'Avg CPU Speed (GHz)' },
    tickInterval: 1,
    endOnTick: false,
    min: 0,
    max: null
  },
  tooltip: {
    xDateFormat: '%A, %b %e, %H:%M:%S'
  },
  series: [{
    id: 'cpuAvg',
    name: 'Average CPU Speed',
    data: initialData()
  }, {
    id: 'cpuMin',
    name: 'Min CPU Speed',
    data: initialData()
  }, {
    id: 'cpuMax',
    name: 'Max CPU Speed',
    data: initialData()
  }]
});
