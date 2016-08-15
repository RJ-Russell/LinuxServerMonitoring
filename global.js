var cpuSpeedChart = 0;
var cpuLoadChart = 0;

// generate some points to render before real samples arrive from feed
var initialData = function() {
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

// Format the uptime field.
var formatUptime = function(timeSeconds) {
  return moment.preciseDiff(0, timeSeconds*1000);
};

// Format the current time.
var formatCurrTime = function(longEpoch) {
  var epochDate = moment(longEpoch);
  var strDate = epochDate.format(" HH:mm:ss dddd, DD MMMM, YYYY");
  return strDate;
};

