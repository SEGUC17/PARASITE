var mongoose = require('mongoose'),
  moment = require('moment'),
  StringValidate = require('../utils/Validators/'),
  Parent = mongoose.model('User');

  module.exports.Search = function(req, res, next) {

    // Parent.find({ Username: { $regex : ".*"+ req.query.search +".*", $options:'i' } }, function(err, result){
    //
    //      return res.status(200).json({result: result})
    //
    //   });

    Parent.find(req.params.username).exec(function(err, parent) {
      if (!StringValidate.isString(req.params.username)) {
    return res.status(422).json({
      err: null,
      msg: 'Username must be valid',
      data: null
    });
  }
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg:
          'Parent with username ' +
          req.params.username +' is retrievred successfully'
        data: parent
      });
    });
  };

  //to be altered
  module.exports.viewProfile = function(req, res, next) {
    Parent.find(req.params.username).exec(function(err, parent) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg:
          'Parent with username ' +
          req.params.username +' is retrievred successfully'
        data: parent
      });
    });
  };

  module.exports.FilterByLevelOfEducation = function(req, res, next) {
    Parent.find(req.params.levelOfEducation).exec(function(err, parent) {
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
          'Parent with username ' +
          req.params.username +' is retrievred successfully'
        data: parent
      });
    });
  };
