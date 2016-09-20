var express = require('express'),
  fs = require('fs'),
  http = require('http'),
  path = require('path'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  config = require('config');

var routePath = './routes/';
var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('port', process.env.PORT || config.get('port') || 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// Load all routes in the routes folder.
fs.readdirSync(routePath).forEach(function (file) {
  var route = routePath + file;
  require(route)(app);
});

app.use(errorHandler());

// Set-up socket.io Communication
io.sockets.on('connection', require('./routes/socket'));

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  if(config.get('mock.temperature')) {
    return;
  }
  var temperatureLogger = require('./libs/temperatureLogger');
  temperatureLogger.start(config.get('loggingInterval'));
})