var mongoose = require('mongoose'),
  moment = require('moment'),
  Validations = require('../utils/validators'),
  User = mongoose.model('User');


module.exports.requestUserValidation = function(req, res, next) {
//TODO: make a request
//Author: Maher
console.log('in the server elhamdullah');
res.writeHead(200, { 'Content-Type': 'text/plain' });
res.end('FROM SERVER: making request');
};


//--------------------------- Profile Info ------------------------- AUTHOR: H

module.exports.getUserInfo = function(req, res, next) {
    User.findOne({ username: req.params.username}).exec(function(err, userInfo) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg: 'User info retrieved successfully',
        data: userInfo
      });
    });
  };