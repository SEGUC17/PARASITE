var mongoose = require('mongoose'),
  moment = require('moment'),
  User = mongoose.model('User'),
  StringValidate = require('../utils/validators/');
  module.exports.getUsers = function(req, res, next) {
    Product.find({}).exec(function(err, products) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg: 'Products retrieved successfully.',
        data: products
      });
    });
  };
  module.exports.Search = function(req, res, next) {

    if (!StringValidate.isString(req.params.username)) {
      return res.status(422).json({
        err: null,
        msg: 'username must be valid',
        data: null
  });
  }
    User.findOne({ username: req.body.username ,isParent :true}).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!product)
      {
        return res
       .status(404)
       .json({ err: null, msg: 'User not found.', data: null });
      }
      res.status(200).json({
        err: null,
        msg:
          'User with username ' +
          req.params.username +' is retrievred successfully',
        data: user
      });
    });
    User.paginate().then(function(result) {
        // result.docs - array of plain javascript objects
        // result.limit - 20
    });
  };

  //to be altered
  module.exports.viewProfile = function(req, res, next) {
    User.findOne({ username: req.body.username }).exec(function(err, user) {
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
    User.findOne({ educationLevels: req.body.educationLevels,isParent :true }).exec(function(err, user) {
      if (!StringValidate.isString(req.body.educationLevels)) {
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
          'User that has children with education levels ' +
          req.params.educationLevels +' is retrievred successfully',
        data: user
      });
    });
    User.paginate().then(function(result) {
        // result.docs - array of plain javascript objects
        // result.limit - 20
    });
  };

  module.exports.FilterBySystemOfEducation = function(req, res, next) {
    User.findOne({ educationSystems: req.body.educationSystems ,isParent :true}).exec(function(err, user) {
      if (!StringValidate.isString(req.body.educationSystems)) {
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
          'User that has children with education levels ' +
          req.params.educationSystems +' is retrievred successfully',
        data: user
      });
    });
    User.paginate().then(function(result) {
        // result.docs - array of plain javascript objects
        // result.limit - 20
    });
  };
