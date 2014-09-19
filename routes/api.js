var config = require('../config'),
    temperatureProbe = require('../libs/temperatureProbe');

module.exports = function(app) {
  app.get('/api/temperature', function(req, res, next) {
    temperatureProbe.read(config.aquariumTempProbeSerial, '*', function(err, temperature) {
      if(err) return next(err);

      res.set('content-type', 'application/json');
      res.status(200).send(temperature);
    });
  });
};
