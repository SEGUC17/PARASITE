var mongoose = require('mongoose'),
  moment = require('moment'),
  User = mongoose.model('User'),
  StringValidate = require('../utils/validators/');

  module.exports.Search = function(req, res, next) {

    // User.find({ Username: { $regex : ".*"+ req.query.search +".*", $options:'i' } }, function(err, result){
    //
    //      return res.status(200).json({result: result})
    //
    //   });

    User.find(req.params.username).exec(function(err, user) {
  //     if (!StringValidate.isString(req.params.username)) {
  //   return res.status(422).json({
  //     err: null,
  //     msg: 'username must be valid',
  //     data: null
  //   });
  // }
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg:
          'User with username ' +
          req.params.username +' is retrievred successfully',
        data: user
      });
    });
  };

  //to be altered
  module.exports.viewProfile = function(req, res, next) {
    User.find(req.params.username).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg:
          'User with username ' +
          req.params.username +' is retrievred successfully',
        data: user
      });
    });
  };

  module.exports.FilterByLevelOfEducation = function(req, res, next) {
    User.find(req.params.levelOfEducation).exec(function(err, user) {
      if (!StringValidate.isString(req.params.username)) {
    return res.status(422).json({
      err: null,
      msg: 'Level Of Education must be valid',
      data: null
    });
  }
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg:
          'User with username ' +
          req.params.username +' is retrievred successfully',
        data: user
      });
    });
  };
