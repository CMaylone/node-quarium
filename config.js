var config = {
  port: 3000, // Application port.
  morganLogFormat : 'dev', // The string pattern defining how morgan should log data.
  aquariumTempProbeSerial: '000005507b51', // Serial Number of the device to read.
  mockTemperatureData: false, // If true the /api/temperature endpoint will make fake temperature data.
  loggingInterval: 30000,

  mongodb: 'mongodb://localhost/aquarium_local'
};

module.exports = config;