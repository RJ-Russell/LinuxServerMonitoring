var cpuLoadChart, cpuSpeedChart;

Highcharts.setOptions({
  global: {
    useUTC: false
  }
});

(function() {
  // Common options shared between charts.
  var cpuChartOptions = {
    chart: {
      type: 'spline',
      width: null,
      height: 250
    },
    credits: { enabled: false },
    title: { text: '' },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 100
    },
    yAxis: {
      min: 0,
      max: null
    },
    tooltip: {
      xDateFormat: '%A, %b %e, %H:%M:%S'
    }
  };

  // Create cpuLoad chart and merge common options in.
  $('#cpuLoad-container').highcharts(Highcharts.merge(cpuChartOptions, {
    chart: {
      events: {
        load: function() {
          cpuLoadChart = $('#cpuLoad-container').highcharts();
        }
      }
    },
    yAxis: {
      tickInterval: 0.1,
      title: {
        text: 'CPU Load'
      }
    },
    series: [{
      id: 'one',
      name: '1-Min Avg',
      data: initialData()
    }, {
      id: 'five',
      name: '5-Min Avg',
      data: initialData()
    }, {
      id: 'fteen',
      name: '15-Min Avg',
      data: initialData()
    }]
  }));

  // Create cpuSpeed chart and merge common options in.
  $('#cpuSpeed-container').highcharts(Highcharts.merge(cpuChartOptions, {
    chart: {
      events: {
        load: function() {
          cpuSpeedChart = $('#cpuSpeed-container').highcharts();
        }
      }
    },
    yAxis: {
      tickInterval: 1,
      title: {
        text: 'CPU Speed (MHz)'
      }
    },
    series: [{
      id: 'spdMin',
      name: 'Min. Speed',
      data: initialData()
    }, {
      id: 'spdMax',
      name: 'Avg. Speed',
      data: initialData()
    }, {
      id: 'spdAvg',
      name: 'Max. Speed',
      data: initialData()
    }]
  }));
})();


// Add dynamic data points to cpuLoad chart
function addToCpuLoadChart(currTime, one, five, fteen) {
  cpuLoadChart.get('one').addPoint([currTime, one], false, true);
  cpuLoadChart.get('five').addPoint([currTime, five], false, true);
  cpuLoadChart.get('fteen').addPoint([currTime, fteen], true, true);
}

// Add dynamic data points to cpuSpeed chart
function addToCpuSpeedChart(currTime, min, avg, max) {
  cpuSpeedChart.get('spdMin').addPoint([currTime, min], false, true);
  cpuSpeedChart.get('spdAvg').addPoint([currTime, avg], false, true);
  cpuSpeedChart.get('spdMax').addPoint([currTime, max], true, true);
}
