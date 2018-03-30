
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var expressSession = require('express-session');
var passport = require('passport');
var cors = require('cors');

//config file
var config = require('./api/config/config');

// mongoose Database connection
require('./api/config/DBConnection');

//router
var router = require('./api/routes/index');

//express app
var app = express();
app.set(config.SECRET);

//middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());

//router
app.use('/api', router);
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
