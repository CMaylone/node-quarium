var config = require('../config'),
    fs = require('fs');


module.exports = function(app) {
  app.get('/api/temp', function(req, res, next) {
    fs.readFile('/sys/bus/w1/devices/28-' + config.aquariumTempProbSerial + '/w1_slave', 'utf8', function(err, data) {
      if(err) return next(err);
      var matches = data.match(/t=([0-9]+)/);
      var temperatureC = parseInt(matches[1]) / 1000;
      var temperatureF = ((temperatureC * 1.8) + 32).toFixed(3);
      var output = '{ "temperature": { "celcius": '+ temperatureC +', "fahrenheit": '+ temperatureF +' } }';
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(output);
    })
  });
};
