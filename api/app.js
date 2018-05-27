var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb','extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '50mb'})); // parse application/json
app.use(bodyParser.json({limit: '50mb', type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

require('./routes')(app, fs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// handle uncaught exceptions w
process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log('uncaughtException');
    console.error(err.stack);
    console.log(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
