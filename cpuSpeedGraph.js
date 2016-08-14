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

var cpuSpeedChart = 0;
(function() {
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
          cpuSpeedChart = $('#cpu-container').highcharts();
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
})();
