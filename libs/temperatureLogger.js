var config = require('config'),
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
  temperatureProbe.read(config.get('aquariumTempProbeSerial'), 'C', function(err, temperature) {
    if(err) return console.log('Failed to read temperature probe.\n%s', err.stack);

    console.log(`${temperature} C`)

    // new TemperatureLog({
    //   temperature: temperature,
    //   sensor: config.get('aquariumTempProbeSerial')
    // }).save(function(err) {
    //     if(err) console.log('Failed to save temperature log.\n%s', err.stack)
    //   })
  })
}