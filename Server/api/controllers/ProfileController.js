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
    // var status = "";
    // if (req.user.isParent) {
    //     status = 'Parent';
    // }
    // if(req.user.isChild){
    //     status = 'Child';
    // }
    // if (req.user.isTeacher) {
    //     status = 'Teacher';
    // }

    // var reqObj = {
    //     status: 'pending',
    //     bio: status +', @'+req.user.username + ',\n' + req.user.email + ', Number of Children : '+ req.user.children.length,
    //     name: req.user.firstName + ' ' + req.user.lastName,
    //     AvatarLink: '../../../assets/images/profile-view/defaultPP.png',
    //     ProfileLink: 'localhost:4200/profile/'+ req.user.username,
    //     image: 'src of an image',
    //     creator: req.user._id
    // };
   
    var reqObj = {
        status: 'pending',
        bio: 'machine learning, AI, Art, Music, Philosophy',
        name: 'Ahmed Khaled',
        AvatarLink: '../../../assets/images/profile-view/defaultPP.png',
        ProfileLink: 'profilemaher.com',
        image: 'imageMaher.com',
        creator: '5ac12591a813a63e419ebce5'
    }
  VCRSchema.create(reqObj, function (err, next) {
   if (err) {
       console.log('duplicate key');
       if(err.message.startsWith('E11000 duplicate key error')){
           return res.status(333).json({
               err: null,
               msg: 'the request already submitted',
               data: null
           });
       }
       else {
           console.log('passing error to next');
           next(err);
       }
      res.status(200).json({
          err: null,
          msg: 'the request is submitted',
          data: null
      })
   }});
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
              }

              user.save(function(err, updatedUser){
                if(err){
                  console.log(err);
                  res.status(500).send();
                } else {
                  res.send(updatedUser);
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


  };