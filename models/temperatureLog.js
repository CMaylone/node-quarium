/*
 * Schema for storing temperature history.
 */

var mongoose = require('mongoose');

var temperatureLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },    // When temperature was read.
  temperature: { type: Number, required: true },   // The temperature in Celsius.
  sensor: { type: String, required: true }         // The serial number of the sensor
});

model.exports = mongoose.model('TemperatureLog', temperatureLogSchema);


