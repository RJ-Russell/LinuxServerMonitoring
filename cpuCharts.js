
var cpuSpeedChart = 0;
var cpuLoadChart = 0;

(function() {
  // Init cpuLoad data to be passed into the chart template
  var initLoadData = [{
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
  }];
  // Create cpuLoad chart
  cpuLoadChart = chartTemplate('cpuLoad-container', cpuLoadChart,
    'CPU Load (%)', initLoadData);

    // Init cpuSpeed data to be passed into the chart template
    var initSpeedData = [{
      id: 'cpuMin',
      name: 'Min. CPU Speed',
      data: initialData()
    }, {
      id: 'cpuAvg',
      name: 'Avg. CPU Speed',
      data: initialData()
    }, {
      id: 'cpuMax',
      name: 'Max. CPU Speed',
      data: initialData()
    }];
    // Create cpuSpeed chart
    cpuSpeedChart = chartTemplate('cpuSpeed-container', cpuSpeedChart,
      'CPU Speed (MHz)', initSpeedData);
})();

// Template for CPU charts
function chartTemplate(container, chart, title, data) {
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
      }
    },
    title: { text: title },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 100
    },
    yAxis: {
      title: { text: title },
      tickInterval: 1,
      endOnTick: false,
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
  cpuLoadChart.get('cpuAvg').addPoint([currTime, avg], false, true);
  cpuLoadChart.get('cpuCurr').addPoint([currTime, curr], false, true);
  cpuLoadChart.get('cpuFull').addPoint([currTime, full], true, true);
}

// Add dynamic data points to cpuSpeed chart
function addToCpuSpeedChart(currTime, min, avg, max) {
  cpuSpeedChart.get('cpuMin').addPoint([currTime, min], false, true);
  cpuSpeedChart.get('cpuAvg').addPoint([currTime, avg], false, true);
  cpuSpeedChart.get('cpuMax').addPoint([currTime, max], true, true);
}
