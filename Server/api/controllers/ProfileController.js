var mongoose = require('mongoose'),
User = mongoose.model('User');
moment = require('moment'),
Validations = require('../utils/validators'),
User = mongoose.model('User');
//VCRSchema = mongoose.model('VerifiedContributerRequest');
VCRSchema = require('../models/VerifiedContributerRequest');
adminController = require('./AdminController');





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
  User.find({_id : req.params.parentId}).exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      err: null,
      msg: 'Users retrieved successfully.',
      data: users
    });
  });
};


  module.exports.linkAnotherParent = function(req, res, next) {


    var id = req.params.parentId;
    User.findOne({_id: id}, function(err, user){
      if(err){
        console.log(err);
        res.status(500).send();
      } else {
          if(!user){
            res.status(404).send();
          } else {
              if(req.body){
                user.children = req.body.children
               // user.children.push(child);
              }

              user.save(function(err, updatedUser){
                if(err){
                  console.log(err);
                  res.status(500).send();
                } else {
                  res.send(updatedUser);
                  user.isParent= true;
                }
              });
            }
      }

        })
};

  module.exports.Unlink = function(req, res, next) {
 User.findByIdAndUpdate(req.params.userId ,  $set , { children : req.body.children }
   ).exec(function(err, unlink) {
      if (err) {
        return next(err);
      }
      
      res.status(200).json({
        err: null,
        msg: 'Your children list was updated successfully.',
        data: unlink
      });
    });
   if(user.children.length==0)
      user.isParent=false;
  //user.children.add(child);
  };



  module.exports.linkAsParent=function(req,res,next){
   User.findOne({_id: req.params.userId}, function(err, user){
      if(err){
        console.log(err);
        res.status(500).send();
      } else {
          if(!user){
            res.status(404).send();
          } else {
              if(req.body){
                user.children.push(child);
                //= req.body.children
              }

              user.save(function(err, updatedUser){
                if(err){
                  console.log(err);
                  res.status(500).send();
                } else {
                  res.send(updatedUser);
                  user.isParent= true;
                }
              });
            }
      }

        })


    };
