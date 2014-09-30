var config = require('../config'),
    temperatureProbe = require('./temperatureProbe'),
    TemperatureLog = require('../models/temperatureLog');

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
  temperatureProbe.read(config.aquariumTempProbeSerial, 'C', function(err, temperature) {
    if(err) console.log('Failed to read temperature probe.\n%s', err.stack);

    new TemperatureLog({
      temperature: temperature,
      probe: config.aquariumTempProbeSerial
    }).save(function(err) {
        console.log('Failed to save temperature log.\n%s', err.stack)
      })
  })
}