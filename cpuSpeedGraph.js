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
        var series = this.series[0];
        var socket = io.connect('http://localhost:8080');
        socket.on('cpu', function (cpu) {
          // when a sample arrives we plot it
          series.addPoint([cpu.x, cpu.y], true, true);
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
    min: 0,
    max: 5
  },
  tooltip: {
    formatter: function() {
      return '<b>'+ this.series.name + '</b><br/>'
        + '[ ' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)
        + ' , '
        + this.y + ' ]';
    }
  },
  series: [{
    name: 'Average CPU Speed',
    data: (function() {
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
    })()
  }]
});

