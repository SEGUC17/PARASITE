
/* eslint-disable sort-keys */
/* eslint-disable no-shadow */
/* eslint-disable no-else-return */

var mongoose = require('mongoose');
var moment = require('moment');
var Validations = require('../utils/validators');
var Encryption = require('../utils/encryption/encryption');
var adminController = require('./AdminController');
var User = mongoose.model('User');
var VCRSchema = mongoose.model('VerifiedContributerRequest');
var Report = mongoose.model('Report');

// author: Heidi
module.exports.getChildren = function (req, res, next) {
  // finding user by username from params
  User.findOne({ username: req.params.username }).exec(function (err, user) {

    if (err) {
      return next(err);
    }
    //checking if user is not found
    if (!user) {
      return res.
        status(404).
        json({
          data: null,
          err: null,
          msg: 'User not found.'
        });

    }
    // adding user's children to response
    res.status(200).json({
      data: user.children,
      err: null,
      msg: 'Children retrieved successfully.'
    });
  });
};
// author: Heidi
module.exports.EditChildIndependence = function (req, res, next) {

  // searching for username in the params

  User.findOne({ username: req.params.username }).exec(function (err, user) {
    if (err) {
      return next(err);
    }
    // checking if user is not found
    if (!user) {
      return res.
        status(404).
        json({
          data: user.isChild,
          err: null,
          msg: 'user not found'
        });
    }


    // checking that the child to be updated birth year < 13

    if (new Date().getFullYear() - user.birthdate.getFullYear() < 13) {

      return res.
        status(202).
        json({
          data: user.isChild,
          err: null,
          msg: 'You cannot make a child under 13 independent.'
        });
    }
    // checking that child is older than 13
    if (new Date().getFullYear() - user.birthdate.getFullYear() === 13 &&
      new Date().getMonth() < user.birthdate.getMonth()) {
      return res.
        status(202).
        json({
          data: user.isChild,
          err: null,
          msg: 'You cannot make a child under 13 independent.'
        });
    }
    var notification = {
      body: 'You are now independant',
      date: moment().toDate(),
      itemUsername: user.username,
      type: 'link'
    };
    // if the previous conditions are false then child is changed successefuly

    User.findOneAndUpdate(
      { username: req.params.username },
      {
        $set: { isChild: false },
        $push:
          { 'notifications': notification }
        },
          { new: true }
  ).
    exec(function (error, updated) {
      if (err) {
        return err;

      }

      res.status(200).json({
        data: user.isChild,
        err: null,
        msg: 'Successefully changed from child to independent.'
      });

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
    email: req.user.email,
    numberOfChildren: req.user.children.length,
    name: req.user.firstName + ' ' + req.user.lastName,
    image: req.user.avatar,
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
  VCRSchema.create(reqObj, function (err, next) {
    // insert the request to the database.
    if (err) {
      console.log('duplicate key');
      if (err.message.startsWith('E11000 duplicate key error')) {
        // if request already existed
        return res.status(400).json({
          err: null,
          msg: 'the request already submitted',
          data: null
        });
      } else {
        console.log('passing error to next');

        return next(err);
      }
    }
    res.status(200).json({
      err: null,
      msg: 'the request is submitted',
      data: null
    });
  });
};

//--------------------------- Profile Info ------------------------- AUTHOR: H

// method that finds a user by id,
// adds the passed child to the user's children list
// then ensure that isParent = true
module.exports.linkAnotherParent = function (req, res, next) {
  var notificationParent = {
    body: 'You have been linked to' + req.body.child,
    date: moment().toDate(),
    itemUsername: req.body.child,
    type: 'link'
  };

  // var id = req.params.parentId;
  User.findByIdAndUpdate(
    req.params.parentId,
    {
      $push: {
        children: req.body.child,
        notifications: notificationParent
      },
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
      var notificationUser = {
        body: 'You have been linked to ' + user.username,
        date: moment().toDate(),
        itemId: user._id,
        type: 'link'
      };
      User.findOneAndUpdate(
        { username: req.body.child },
        {
          $push:
            { 'notifications': notificationUser }
        }
        , { new: true },
        function (errr, updatedUser) {
          console.log('add the notification');
          // console.log(updatedUser.notifications);
          if (errr) {
            return res.status(402).json({
              data: null,
              err: 'error occurred during adding ' +
                'the notification'
            });
          }
        }
      );

      return res.status(200).json({
        data: user,
        err: null,
        msg: 'Link added succesfully.'
      });
    }
  );
};

// method that finds a user by id,
// adds the passed child to the user's children list
// then ensure that isParent = true
module.exports.addAsAParent = function (req, res, next) {
  var notification = {
    body: req.body.child + 'added you as a parent',
    date: moment().toDate(),
    itemUsername: req.body.child,
    type: 'link'
  };


  User.findByIdAndUpdate(
    req.params.parentId,
    {
      $push: {
        children: req.body.child,
        notifications: notification
      },
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

// method that deletes the passed child from the selected parent's children list
module.exports.unLinkChild = function (req, res, next) {
  var notification = {
    body: req.body.child + 'unlinked you',
    date: moment().toDate(),
    itemId: req.params.parentId,
    type: 'link'
  };

  User.findByIdAndUpdate(
    req.params.parentId,
    {
      $pull: { children: { $in: [req.body.child] } },
      $push: {
        children: req.body.child,
        notifications: notification
      }
    },
    { new: true },
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

  // match user to one of the users in the database
  User.findById({ _id: req.params.id }, function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      res.status(401).json({
        data: null,
        err: null,
        msg: 'User does not'
      });

      return;
    }

    // compare entered password with existing hashed password in database
    Encryption.comparePasswordToHash(req.body.oldpw, user.password, function (
      err2,
      passwordMatches
    ) {
      if (err2) {
        return next(err2);
      } else if (!passwordMatches) {

        return res.status(401).json({
          data: user,
          err: null,
          msg: 'Password is incorrect'
        });

      }

      // hash the new password
      Encryption.hashPassword(req.body.newpw, function (err3, hash) {
        if (err3) {
          return next(err3);
        }
        //console.log(hash);
        // update user password with hash
        User.findByIdAndUpdate(
          { _id: req.params.id },
          { password: hash }, function (err4, user2) {
            if (err4) {
              return next(err4);
            }
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

//author:Haidy

module.exports.UnlinkIndependent = function (req, res, next) {
  var notification = {
    body: req.user.username + ' unlinked you',
    date: moment().toDate(),
    itemUsername: req.user.username,
    type: 'link'
  };

  // checking whether the signed-in user is independent
  if (req.user.isChild) {


    return res.
      status(403).
      json({
        data: null,
        err: null,
        msg: 'user cannot take this action'
      });
  }

  //}
  // searching for username given in the parameter
  User.findOne({ username: req.params.username }).exec(function (err, user) {

    if (err) {
      return err;
    }
    // checking if the username in the params is a parent to the logged in user

    if (user.children.indexOf(req.user.username) < 0) {


      return res.
        status(403).
        json({
          data: null,
          err: null,
          msg: 'parent and child accounts are not linked'
        });
    }
    // updating parent's children list

    User.findOneAndUpdate(
      { username: user.username },
      {
        $pull: { children: { $in: [req.user.username] } },
        $push: { notifications: notification }
      }, { new: true }
    ).
      exec(function (error, updated) {
        if (error) {
          return error;
        }

        res.status(200).json({
          data: updated.children,
          err: null,
          msg: 'Successefully removed child from parent\'s list of children'
        });

      });

  });
};
module.exports.changeChildInfo = function (req, res, next) {
  User.findOne({
    username: req.body.username,
    _id: { $ne: req.body.id }
  }, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      console.log(user.username);

      return res.status(403).json({
        data: user,
        err: null,
        msg: 'Username already exists'
      });
    } else {
      User.findOne({
        email: req.body.email,
        _id: { $ne: req.body.id }
      }, function (err2, user2) {
        if (user2) {
          return res.status(403).json({
            data: user2,
            err: null,
            msg: 'Email already exists'
          });
        } else {

          User.findByIdAndUpdate(
            req.body.id,
            {
              $set: {
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                address: req.body.address,
                birthdate: req.body.birthdate,
                phone: req.body.phone,
                educationSystem: req.body.educationSystem,
                educationLevel: req.body.educationLevel
              }
            }, { new: true },
            function (err, user3) {
              if (err) {
                return next(err);
              }
              if (!user3) {
                return res.status(404).json({
                  data: null,
                  err: null,
                  msg: 'User not found.'
                });
              }

              return res.status(200).json({
                data: user3,
                err: null,
                msg: 'Info updated successfully.'
              });
            }
          );
        }
      });
    }
  });
};

module.exports.ChangeInfo = function (req, res, next) {

  User.findOne({
    username: req.body.username,
    _id: { $ne: req.params.id }
  }, function (err, user1) {
    if (err) {
      return next(err);
    } else if (user1) {

      return res.status(403).json({
        data: null,
        err: null,
        msg: 'Username already exists.'
      });
    }

    User.findOne({
      email: req.body.email,
      _id: { $ne: req.params.id }
    }, function (err, user2) {
      if (err) {
        return next(err);
      } else if (user2) {

        return res.status(403).json({
          data: null,
          err: null,
          msg: 'Email already exists.'
        });
      }

      User.findByIdAndUpdate(req.params.id, {
        $set: {
          address: req.body.address,
          birthdate: new Date(req.body.birthdate),
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          username: req.body.username
        }
      }, { new: true }, function (err, user) {
        if (err) {
          return next(err);
        }

        return res.status(200).json({
          data: user,
          err: null,
          msg: 'User personal info updated successfully.'
        });
      });
    });
  });
};

module.exports.reportUser = function (req, res, next) {
  Report.create(req.body, function (error) {
    if (error) {
      return next(error);
    }

    return res.status(201).json({
      data: req.body,
      error: null,
      msg: 'Report sent successfully'
    });
  });
};

module.exports.changeProfilePic = function (req, res, next) {

  User.findByIdAndUpdate(
    req.body.id,
    { $set: { avatar: req.body.url } }, { new: true },
    function (err, user3) {
      if (err) {
        return next(err);
      }
      if (!user3) {
        return res.status(404).json({
          data: null,
          err: null,
          msg: 'User not found.'
        });
      }

      return res.status(200).json({
        data: user3,
        err: null,
        msg: 'Profile picture updated successfully.'
      });
    }
  );
};
