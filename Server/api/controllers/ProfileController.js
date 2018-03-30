
var mongoose = require('mongoose'),
  moment = require('moment'),
  Validations = require('../utils/validators'),
  User = mongoose.model('User');
  //VCRSchema = mongoose.model('VerifiedContributerRequest');
  VCRSchema = require('../models/VerifiedContributerRequest');
  adminController = require('./AdminController');

module.exports.requestUserValidation = function(req, res, next) {

  const newRequest = {
    status:'pending',
    bio: 'hello world bio',
    name: 'maher',
    AvatarLink: 'maher.com',
    ProfileLink: 'profilemaher.com',
    image: 'imageMaher.com',
  };
    console.log('inside profile controller before calling createVCR');

  VCRSchema.createVCR(newRequest);

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
