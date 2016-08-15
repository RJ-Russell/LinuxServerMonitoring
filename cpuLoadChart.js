(function() {
  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });

  $('#cpuLoad-container').highcharts({
    chart: {
      type: 'spline',
      events: {
        load: function() {
          cpuLoadChart = $('#cpuLoad-container').highcharts();
        }
      }
    },
    title: { text: '' },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 100
    },
    yAxis: {
      title: { text: 'CPU Load (%)' },
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
      name: 'Avg. CPU Load',
      data: initialData()
    }, {
      id: 'cpuCurr',
      name: 'Current CPU Load',
      data: initialData()
    }, {
      id: 'cpuFull',
      name: 'Full CPU Load',
      data: initialData()
    }]
  });
})();

var addToCpuLoadChart = function(currTime, avg, curr, full) {
  var cpuAvgSer = cpuLoadChart.get('cpuAvg');
  var cpuCurrSer = cpuLoadChart.get('cpuCurr');
  var cpuFullSer = cpuLoadChart.get('cpuFull');

  cpuAvgSer.addPoint([currTime, avg], false, true);
  cpuCurrSer.addPoint([currTime, curr], false, true);
  cpuFullSer.addPoint([currTime, full], true, true);
}

