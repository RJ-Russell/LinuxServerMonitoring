
var cpuSpeedChart = 0;
var cpuLoadChart = 0;

(function() {
  // Init cpuLoad data to be passed into the chart template
  var initLoadData = [{
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
  }];
  // Create cpuLoad chart
  cpuLoadChart = chartTemplate('cpuLoad-container', cpuLoadChart,
    'CPU Load', 0.2, initLoadData);

    // Init cpuSpeed data to be passed into the chart template
    var initSpeedData = [{
      id: 'spdMin',
      name: 'Min. Speed',
      data: initialData()
    }, {
      id: 'spdAvg',
      name: 'Max. Speed',
      data: initialData()
    }, {
      id: 'spdMax',
      name: 'Avg. Speed',
      data: initialData()
    }];
    // Create cpuSpeed chart
    cpuSpeedChart = chartTemplate('cpuSpeed-container', cpuSpeedChart,
      'CPU Speed (MHz)', 1, initSpeedData);
})();

// Template for CPU charts
function chartTemplate(container, chart, title, interval, data) {
  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });
  $('#'+container).highcharts({
    chart: {
      type: 'spline',
      events: {
        load: function() {
          chart = $('#'+container).highcharts();
        }
      },
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
      title: { text: title },
      tickInterval: interval,
      min: 0,
      max: null
    },
    tooltip: {
      xDateFormat: '%A, %b %e, %H:%M:%S'
    },
    series: data
  });
  return chart;
};

// Add dynamic data points to cpuLoad chart
function addToCpuLoadChart(currTime, avg, curr, full) {
  cpuLoadChart.get('one').addPoint([currTime, avg], false, true);
  cpuLoadChart.get('five').addPoint([currTime, curr], false, true);
  cpuLoadChart.get('fteen').addPoint([currTime, full], true, true);
}

// Add dynamic data points to cpuSpeed chart
function addToCpuSpeedChart(currTime, min, avg, max) {
  cpuSpeedChart.get('spdMin').addPoint([currTime, min], false, true);
  cpuSpeedChart.get('spdAvg').addPoint([currTime, avg], false, true);
  cpuSpeedChart.get('spdMax').addPoint([currTime, max], true, true);
}
