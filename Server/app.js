// ---------------------------- Requirements ----------------------------- //
require('./api/config/DBConnection');
var bodyParser = require('body-parser');
var compression = require('compression');
var config = require('./api/config/config');
var cors = require('cors');
var express = require('express');
var helmet = require('helmet');
var initPassport = require('./api/passport/init');
var logger = require('morgan');
var passport = require('passport');
var router = require('./api/routes/index')(passport);
// -------------------------- End of "Requirements" --------------------- //

// -------------------------- Variables Dependancies -------------------- //
var app = express();
// -------------------------- End of "Variables Dependancies" ----------- //


app.set(config.SECRET);

// Disabled By Wessam
app.disable('etag');


// -------------------------- Middleware --------------------------------- //
app.use(cors({
  credentials: true,
  origin: true
}));
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
initPassport(passport);
app.use('/api', router);
// -------------------------- End of "Middleware" ------------------------ //


// -------------------------- Error Handlers ----------------------------- //
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
// -------------------------- End of "Error Handlers" -------------------- //

module.exports = app;
