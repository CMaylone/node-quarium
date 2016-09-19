var config = require('config'),
    temperatureProbe = require('./temperatureProbe');

var intervalTimer; // stores interval timer

module.exports.start = function(loggingInterval) {
  setInterval(logTemperature,loggingInterval)
};

module.exports.stop = function() {
  if(intervalTimer) {
    clearInterval(intervalTimer);
  }
};

function logTemperature() {
  temperatureProbe.read(config.get('aquariumTempProbeSerial'), 'C', function(err, temperature) {
    if(err) return console.log('Failed to read temperature probe.\n%s', err.stack);

    console.log(`${temperature} C`)
  })
}