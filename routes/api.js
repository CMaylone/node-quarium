var config = require('../config'),
    temperatureProbe = require('../libs/temperatureProbe');

module.exports = function(app) {
  app.get('/api/temperature', function(req, res, next) {
    if(!config.mockTemperatureData) {
      temperatureProbe.read(config.aquariumTempProbeSerial, '*', function(err, temperature) {
        if(err) return next(err);

        res.set('content-type', 'application/json');
        res.status(200).send(temperature);
      });
    } else {
      res.set('content-type', 'application/json');
      res.status(200).send({celsius:25, fahrenheit:Math.floor((Math.random() * 100) + 1)});
    }
  });
};
