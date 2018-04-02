var mongoose = require('mongoose'),
User = mongoose.model('User');
moment = require('moment'),
Validations = require('../utils/validators'),
User = mongoose.model('User');
VCRSchema = mongoose.model('VerifiedContributerRequest');
// VCRSchema = require('../models/VerifiedContributerRequest');
adminController = require('./AdminController');
mongoose.set('debug', true);





module.exports.getChildren = function (req, res, next) {
   
    User.findById(req.params.userId).exec(function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res
                .status(404)
                .json({ err: null, msg: 'User not found.', data: null });
        }

        res.status(200).json({
            err: null,
            msg: 'Children retrieved successfully.',
            data: user.children
        });
    });
};
 
module.exports.requestUserValidation = function(req, res, next) {



  console.log('inside profile controller before calling createVCR');
   VCRSchema.create(req.body.obj, function (err, next) {
       if (err) {
           if(err.message.startsWith('E11000 duplicate key error')){
               res.status(333).json({
                   err: null,
                   msg: 'the request already submitted',
                   data: null
               })
           }
           else {
               next(err);
           }
       }

   });
  console.log("hehheeeerrreeee");
  //     console.log('ssssssss' + out.message());

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
