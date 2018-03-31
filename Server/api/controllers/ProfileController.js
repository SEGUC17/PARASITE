var mongoose = require('mongoose'),
  moment = require('moment'),
  Validations = require('../utils/validators'),
  User = mongoose.model('User');
  //VCRSchema = mongoose.model('VerifiedContributerRequest');
  VCRSchema = require('../models/VerifiedContributerRequest');
  adminController = require('./AdminController');

module.exports.requestUserValidation = function(req, res, next) {



  console.log('inside profile controller before calling createVCR');

  VCRSchema.createVCR(req.body.obj);

  console.log('inside profile controller and finishing');

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