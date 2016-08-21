/**
 * Copyright (C) 2015 RJ Russell
 *
 * fileSizeChart.js: Creates the pie chart for used and free disk space.
 *
 **/

(function() {
  // Set the chart options and build the pie chart.
  $('#fsSize-container').highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: ''
    },
    tooltip: {
      pointFormat: '{point.percentage:.2f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      type: 'pie',
      name: 'File System',
      data: [
        ['Free Disk (%)', 0],
        ['Used Disk (%)', 0]
      ]
    }]
  });
})();

// Dynamically updates the chart.
function updateDiskPie(usedPercent) {
  var freePercent = 100 - usedPercent;

  $('#fsSize-container').highcharts().series[0].points[0].update(freePercent);
  $('#fsSize-container').highcharts().series[0].points[1].update(usedPercent);
}
