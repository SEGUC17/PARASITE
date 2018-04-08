/* eslint-disable sort-keys */
/* eslint-disable no-shadow */
var mongoose = require('mongoose');
var moment = require('moment');
var Validations = require('../utils/validators');
var Encryption = require('../utils/encryption/encryption');
var adminController = require('./AdminController');
var User = mongoose.model('User');
var VCRSchema = mongoose.model('VerifiedContributerRequest');


module.exports.getChildren = function (req, res, next) {
  User.findOne({ username: req.params.username }).exec(function (err, user) {
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

// @author: MAHER
// requestUserValidation() take some of the
// information of the User and create a new VC request entity,
// and insert it to the database db.(VerifiedContributerRequest).

module.exports.requestUserValidation = function (req, res, next) {
  var status = '';
  if (req.user.isParent) {
    status = 'Parent';
  }
  if (req.user.isChild) {
    status = 'Child';
  }
  if (req.user.isTeacher) {
    status = 'Teacher';
  }

  var reqObj = {
    status: 'pending',
    bio: status + ', @' + req.user.username + ',\n' + req.user.email +
      ', Number of Children : ' + req.user.children.length,
    name: req.user.firstName + ' ' + req.user.lastName,
    AvatarLink: '../../../assets/images/profile-view/defaultPP.png',
    ProfileLink: 'localhost:4200/profile/' + req.user.username,
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
      if (err.message.startsWith('E11000 duplicate key error')) {    // if request already existed
        return res.status(400).json({
          err: null,
          msg: 'the request already submitted',
          data: null
        });
      } else {
        console.log('passing error to next');
        next(err);
      }
      res.status(200).json({
        err: null,
        msg: 'the request is submitted',
        data: null
      });
    }
  });
};


//--------------------------- Profile Info ------------------------- AUTHOR: H


module.exports.linkAnotherParent = function (req, res, next) {

  var id = req.params.parentId;
  User.findByIdAndUpdate(
    req.params.parentId,
    {
      $push: { children: req.body.child },
      $set: { isParent: true }
    }, { new: true },
    function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(404).json({
          data: null,
          err: 'User not found.',
          msg: null
        });
      }

      return res.status(200).json({
        data: user,
        err: null,
        msg: 'Link added succesfully.'
      });
    }
  );
};


module.exports.addAsAParent = function (req, res, next) {
  User.findByIdAndUpdate(
    req.params.parentId,
    {
      $push: { children: req.body.child },
      $set: { isParent: true }
    }, { new: true },
    function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(404).json({
          data: null,
          err: 'User not found.',
          msg: null
        });
      }

      return res.status(200).json({
        data: user,
        err: null,
        msg: 'Link added succesfully.'
      });
    }
  );
};

module.exports.unLinkChild = function (req, res, next) {
  User.findByIdAndUpdate(
    req.params.parentId,
    { $pull: { children: { $in: [req.body.child] } } }, { new: true },
    function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(404).json({
          data: null,
          err: 'User not found.',
          msg: null
        });
      }

      return res.status(200).json({
        data: user,
        err: null,
        msg: 'Link removed succesfully.'
      });
    }
  );
};

module.exports.changePassword = function (req, res, next) {

  console.log('Old Password entered is: ', req.body.oldpw);
  // match user to one of the users in the database
  User.findById({ _id: req.params.id }, function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      console.log('Username is incorrect');
      res.status(401).json({
        data: null,
        err: null,
        msg: 'User does not'
      });

      return;
    }

    console.log('New Password to enter: ', req.body.newpw);
    // compare entered password with existing hashed password in database
    Encryption.comparePasswordToHash(req.body.oldpw, user.password, function (
      err2,
      passwordMatches
    ) {
      if (err2) {
        return next(err2);
      } else if (!passwordMatches) {
        console.log('Password entered is incorrect');

        return res.status(401).json({
          data: null,
          err: null,
          msg: 'Password is incorrect'

        });

      }

      // hash the new password
      Encryption.hashPassword(req.body.newpw, function (err3, hash) {
        if (err3) {
          return next(err3);
        }
        console.log(hash);
        // update user password with hash
        User.findByIdAndUpdate(
          { _id: req.params.id },
          { password: hash }, function (err4, user2) {
            if (err4) {
              return next(err4);
            }
            console.log('User password updated successfully.');
            res.status(200).json({
              data: user2,
              err: null,
              msg: 'User password updated successfully.'
            });
          }
        );
      });
    });
  });
};
