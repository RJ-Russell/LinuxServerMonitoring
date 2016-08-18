(function () {

  var gaugeOptions = {
    chart: {
      type: 'solidgauge'
    },
    title: null,
    pane: {
      center: ['50%', '85%'],
      size: '140%',
      startAngle: -90,
      endAngle: 90,
      background: {
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },
    tooltip: {
      enabled: false
    },
    // the value axis
    yAxis: {
      stops: [
        [0.1, '#55BF3B'], // green
        [0.5, '#DDDF0D'], // yellow
        [0.9, '#DF5353'] // red
      ],
      lineWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      title: {
        y: -70
      },
      labels: {
        y: 16
      }
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    }
  };

  // RAM Gauge
  $('#ram-container').highcharts(Highcharts.merge(gaugeOptions, {
    yAxis: {
      min: 0,
      max: 200,
      title: {
        text: 'Speed'
      }
    },
    credits: {
      enabled: false
    },

    series: [{
      name: 'Speed',
      dataLabels: {
        format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'white') + '">{y}</span><br/>' +
          '<span style="font-size:12px;color:silver">km/h</span></div>'
      },
      tooltip: {
        valueSuffix: ' km/h'
      },
      data: [80]
    }]
  }));

  $('#bufCache-container').highcharts(Highcharts.merge(gaugeOptions, {
    yAxis: {
      min: 0,
      max: 5,
      title: {
        text: 'RPM'
      }
    },

    series: [{
      name: 'RPM',
      data: [1],
      dataLabels: {
        format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'white') + '">{y:.1f}</span><br/>' +
          '<span style="font-size:12px;color:silver">* 1000 / min</span></div>'
      },
      tooltip: {
        valueSuffix: ' revolutions/min'
      }
    }]

  }));

  $('#swap-container').highcharts(Highcharts.merge(gaugeOptions, {
    yAxis: {
      min: 0,
      max: 5,
      title: {
        text: 'RPM'
      }
    },

    series: [{
      name: 'RPM',
      data: [1],
      dataLabels: {
        format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'white') + '">{y:.1f}</span><br/>' +
          '<span style="font-size:12px;color:silver">* 1000 / min</span></div>'
      },
      tooltip: {
        valueSuffix: ' revolutions/min'
      }
    }]

  }));
  // Bring life to the dials
  function updateRamGauge() {
    // Speed
    var chart = $('#container-speed').highcharts(),
      point,
      newVal,
      inc;

    if (chart) {
      point = chart.series[0].points[0];
      inc = Math.round((Math.random() - 0.5) * 100);
      newVal = point.y + inc;

      if (newVal < 0 || newVal > 200) {
        newVal = point.y - inc;
      }

      point.update(newVal);
    }
  }

  function updateBufCacheGauge() {
    // RPM
    var chart = $('#container-rpm').highcharts();
    if (chart) {
      point = chart.series[0].points[0];
      inc = Math.random() - 0.5;
      newVal = point.y + inc;

      if (newVal < 0 || newVal > 5) {
        newVal = point.y - inc;
      }

      point.update(newVal);
    }
  }
})();
