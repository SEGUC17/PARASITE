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
  User.findOne({username: req.params.username}).exec(function (err, user) {
      if (err) {
          return next(err);
      }

      if (!user) {
          return res.
              status(404).
              json({
      data: null,
      err: null,
      msg: 'User not found.'
      });

      }

res.status(200).json({
          data: user.children,
          err: null,
          msg: 'Children retrieved successfully.'
      });
  });
};
 /*
    @author: MAHER
    requestUserValidation() take some of the information of the User and create a new VC request entity,
    and insert it to the database db.(VerifiedContributerRequest).
  */
module.exports.requestUserValidation = function(req, res, next) {
    var status = "";
    if (req.user.isParent) {
        status = 'Parent';
    }
    if(req.user.isChild){
        status = 'Child';
    }
    if (req.user.isTeacher) {
        status = 'Teacher';
    }

    var reqObj = {
        status: 'pending',
        bio: status +', @'+req.user.username + ',\n' + req.user.email + ', Number of Children : '+ req.user.children.length,
        name: req.user.firstName + ' ' + req.user.lastName,
        AvatarLink: '../../../assets/images/profile-view/defaultPP.png',
        ProfileLink: 'localhost:4200/profile/'+ req.user.username,
        image: 'src of an image',
        creator: req.user._id
    };
    // dummy request obj for testing.
    // var reqObj = {
    //     status: 'pending',
    //     bio: 'machine learning, AI, Art, Music, Philosophy',
    //     name: 'Ahmed Khaled',
    //     AvatarLink: '../../../assets/images/profile-view/defaultPP.png',
    //     ProfileLink: 'profilemaher.com',
    //     image: 'imageMaher.com',
    //     creator: '5ac12591a813a63e419ebce5'
    // }
  VCRSchema.create(reqObj, function (err, next) {   // insert the request to the database.
   if (err) {
       console.log('duplicate key');
       if(err.message.startsWith('E11000 duplicate key error')){    // if request already existed
           return res.status(400).json({
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
  User.find({username : req.params.username}).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      err: null,
      msg: 'User retrieved successfully.',
      data: {
        'id': user._id,
        'address': user.address,
        'birthdate': user.birthdate,
        'children': user.children,
        'email': user.email,
        'firstName': user.firstName,
        'isAdmin': user.isAdmin,
        'isChild': user.isChild,
        'isParent': user.isParent,
        'isTeacher': user.isTeacher,
        'lastName': user.lastName,
        'phone': user.phone,
        'schedule': user.schedule,
        'studyPlans': user.studyPlans,
        'username': user.username,
        'verified': user.verified
      }
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
                console.log(user.children);
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
