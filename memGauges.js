/**
 * Copyright (C) 2015 RJ Russell
 *
 * memGauges.js: Creates the memory gauges for used and free RAM
 *  and for used and free swap.
 *
 **/

(function () {
  // Common options to be shared between the gauges.
  var memoryGaugeOptions = {

    chart: {
      type: 'solidgauge',
    },
    credits: {
      enabled: false
    },
    title: {
      text: ''
    },
    tooltip: {
      borderWidth: 0,
      backgroundColor: 'none',
      shadow: false,
      style: {
        fontSize: '16px'
      },
      pointFormat: `{series.name}<br><span style="font-size:2em;
      color: {point.color}; font-weight: bold">{point.y}%</span>`,
      positioner: function (labelWidth, labelHeight) {
        return {
          x: 210 - labelWidth / 2,
          y: 160
        };
      }
    },
    pane: {
      startAngle: 0,
      endAngle: 360,
      background: [{ // Track for Free
        outerRadius: '102%',
        innerRadius: '78%',
        backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
        borderWidth: 0
      }, { // Track for Used
        outerRadius: '77%',
        innerRadius: '53%',
        backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.3).get(),
        borderWidth: 0
      }]
    },
    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: []
    },
    plotOptions: {
      solidgauge: {
        borderWidth: '34px',
        dataLabels: {
          enabled: false
        },
        linecap: 'square',
        stickyTracking: false
      }
    }
  };

  // Builds the RAM gauge.
  $('#ram-container').highcharts(Highcharts.merge(memoryGaugeOptions, {
    series: [{
      name: 'Free',
      borderColor: Highcharts.getOptions().colors[0],
      data: [{
        color: Highcharts.getOptions().colors[0],
        radius: '90%',
        innerRadius: '90%',
        y: 0
      }]
    }, {
      name: 'Used',
      borderColor: Highcharts.getOptions().colors[1],
      data: [{
        color: Highcharts.getOptions().colors[1],
        radius: '65%',
        innerRadius: '65%',
        y: 0
      }]
    }]
  }));

  // Builds the swap mem guage.
  $('#swap-container').highcharts(Highcharts.merge(memoryGaugeOptions, {
    series: [{
      name: 'Free',
      borderColor: Highcharts.getOptions().colors[0],
      data: [{
        color: Highcharts.getOptions().colors[0],
        radius: '90%',
        innerRadius: '90%',
        y: 0
      }]
    }, {
      name: 'Used',
      borderColor: Highcharts.getOptions().colors[1],
      data: [{
        color: Highcharts.getOptions().colors[1],
        radius: '65%',
        innerRadius: '65%',
        y: 0
      }]
    }]
  }));
})();

// dynamically updates whichever gauge is passed in with the
// associated values.
function updateMemGauge(container, total, free, used) {
  var newFree = (free/total) * 100;
  var memFreeGauge = $(container).highcharts().series[0].points[0];
  memFreeGauge.update(parseFloat(newFree.toFixed(2)));

  var newUsed = (used/total) * 100;
  var memUsedGauge = $(container).highcharts().series[1].points[0];
  memUsedGauge.update(parseFloat(newUsed.toFixed(2)));
}
