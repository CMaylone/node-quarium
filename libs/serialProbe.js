var fs = require('fs');

/**
 * @param serial Serial number of the probe to read.
 * @param cb async callback
 * @returns Integer output from /sys/bus/w1/devices/28-{serial}/w1_slave
 */
module.exports.read = function(serial, cb) {
  if(!serial) {
    return cb(new Error('serial is required.'));
  }

  fs.readFile(`/sys/bus/w1/devices/28-${serial}/w1_slave`, 'utf8', function(err, data) {
    if(err) return cb(err);
    var output = parseInt(data.match(/t=([0-9]+)/)[1]);
    console.log(`Raw reading: ${output}`)

    cb(undefined, output);
  })
};