
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var passport = require('passport');
var AddPsychRequest = require('./api/models/AddPsychologistRequest');

//config file
var config = require('./api/config/config');
//router
var router = require('./api/routes/index');

//express app
var app = express();
app.set(config.SECRET);

//middleware
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//router
app.use('/api', router);


// mongoose Database connection
require('./api/config/DBConnection');


// 500 internal server error handler
app.use(function (err, req, res, next) {
  if (err.statusCode === 404) {
    return next();
  }
  res.status(500).json({
    // Never leak the stack trace of the err if running in production mode
    data: null,
    err: config.ENV === 'prod' ? null : err,
    msg: '500 Internal Server Error'
  });
});

// 404 error handler
app.use(function (req, res) {
  res.status(404).json({
    data: null,
    err: null,
    msg: '404 Not Found'
  });
});

module.exports = app;
