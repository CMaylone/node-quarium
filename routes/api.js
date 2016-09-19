var config = require('config'),
    temperatureProbe = require('../libs/temperatureProbe');

module.exports = function(app) {
  app.get('/api/temperature', function(req, res, next) {
    if(!config.get('mockTemperatureData')) {
      temperatureProbe.read(config.get('aquariumTempProbeSerial'), '*', function(err, temperature) {
        if(err) return next(err);

        res.set('content-type', 'application/json');
        res.status(200).send(temperature);
      });
    } else {
      res.set('content-type', 'application/json');
      res.status(200).send({celsius:25, fahrenheit:Math.floor((Math.random() * 100) + 1)});
    }
  });

  app.get('/api/historic/temperature', function(req, res, next) {
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;

    console.log(req.query);

    TemperatureLog.find({
      timestamp : {
        $gte: startDate,
        $lte: endDate
      }
    }).exec(function(err, temperatures) {
      if(err) return next(err);

      res.set('content-type', 'application/json');
      res.status(200).send(temperatures);
    })
  });
};
