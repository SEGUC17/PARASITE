// -------------------------- Requirements ----------------------------- //
require('./api/config/DBConnection');
var config = require('./api/config/config');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var passport = require('passport');
var path = require('path');
require('./api/config/passport')(passport);
var router = require('./api/routes/index')(passport);
// -------------------------- End of "Requirements" --------------------- //

// -------------------------- Dependancies ------------------------------ //
var app = express();
app.set(config.SECRET);
// -------------------------- End of "Dependancies" --------------------- //

//middleware
// Disabling etag for testing
// @author: Wessam
app.disable('etag');

// Create link to Angular build directory
var distDir = path.join(__dirname, '/dist/');
app.use(express.static(distDir));
// -------------------------- Middleware -------------------------------- //
app.use(cors({
  credentials: true,
  origin: true
}));
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', router);
// -------------------------- End of "Middleware" ----------------------- //

// -------------------------- Error Handlers ---------------------------- //
// 500 internal server error handler
app.use(function (err, req, res, next) {
  console.log(err);
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
// -------------------------- End of "Error Handlers" ------------------- //

// -------------------------- Exports ----------------------------------- //
module.exports = app;
// -------------------------- End of "Exports" -------------------------- //
