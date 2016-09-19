/**
 * @param serial Serial number of the probe to read.
 * @param cb async callback
 * @returns Integer output from /sys/bus/w1/devices/28-{serial}/w1_slave
 */
module.exports.read = function(serial, cb) {
  if(!serial) {
    return cb(new Error('device serial number is required.'));
  }

  parseRawReadingFromFile(`/sys/bus/w1/devices/28-${serial}/w1_slave`, cb);
};

module.exports.parseRawReadingFromFile = function(fileName, cb) {
  let fs = require('fs');

  fs.readFile(fileName, 'utf8', function(err, data) {
    if(err) return cb(err);

    if(data.match(/NO/)) {
      return cb(new Error('devices it not ready to be read'));
    } else {
      var rawIntReading = parseInt(data.match(/t=([0-9]+)/)[1]);
      return cb(err, rawIntReading);
    }
  })
}
