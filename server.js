var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    config = require('./config');

var routePath = './routes/';
var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('port', process.env.PORT || config.port || 3000);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.use(morgan(config.morganLogFormat));
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

// Start the server.
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
