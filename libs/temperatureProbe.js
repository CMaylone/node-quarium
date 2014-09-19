var serialProbe = require('./serialProbe');

/**
 * Reads a serial temperature probe.
 * @param serial serial number of the probe to read.
 * @param unitOfMeasurement Unit of measure such as celsius, fahrenheit or both to report the temperature
 * @param cb async callback
 * @returns temperature read by the probe in the provided unit of measurement.
 */
module.exports.read = function(serial, unitOfMeasurement, cb) {
  if(!serial) {
    return cb(new Error('serial is required.'))
  }

  if(!unitOfMeasurement) {
    return cb(new Error('unitOfMeasurement is required. Use values such as c, celsius, f, fahrenheit'))
  }

  serialProbe.read(serial, function(err, raw) {
    if(err) return cb(err);
    // Temperature from the probe is reported as 1/1000 degrees of Celsius.
    var tempCelsius = raw / 1000;
    switch(unitOfMeasurement.toLowerCase()) {
      case 'c':
      case 'centigrade':
      case 'celsius':
        return cb(undefined, tempCelsius);
        break;
      case 'f':
      case 'fahrenheit':
        return cb(undefined, toFahrenheit(tempCelsius));
        break;
      default:
        // Return both units of measurements.
        return cb(undefined, { celsius:tempCelsius, fahrenheit:toFahrenheit(tempCelsius) })
    }
  });
};

/**
 * Converts a celsius temperature into fahrenheit.
 * @param temperatureCelsius
 * @returns {string} representing the temperature in fahrenheit.
 */
function toFahrenheit(temperatureCelsius) {
  return ((temperatureCelsius * 1.8) + 32).toFixed(3)
}