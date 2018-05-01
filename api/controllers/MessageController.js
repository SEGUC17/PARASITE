/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable object-shorthand */
/* eslint-disable complexity */

var mongoose = require('mongoose');
var moment = require('moment');
var Validations = require('../utils/validators');
var models = require('../models/Message');
var Message = mongoose.model('Message');
var User = mongoose.model('User');
var unregisteredReply = require('../utils/emails/email-verification');
var REGEX = require('../utils/validators/REGEX');


// add a message to the messages collection in the DB
module.exports.sendMessage = function (req, res, next) {
  // Security Check
  delete req.body.sentAt;
User.findOne({ username: req.body.sender }, function (err, user) {
     if (err) {
                  return next(err);
       }
       // end if
       //checking if the user is an admin & the message is from an unregistered user
       if (user.isAdmin === true && req.body.recipient.match(REGEX.MAIL_REGEX)) {
              // send the reply through the unregistered user's personal email
              unregisteredReply.adminReply(req.body.recipient, req.body.body);
       }

  // create new entry in DB
  Message.create(req.body, function (err, msg) {
    if (err) {
      return next(err);
    }
    var notification = {
      body: 'You have got a new message from ' + msg.sender,
      date: moment().toDate(),
      itemId: msg._id,
      type: 'message'
  };
  User.findOneAndUpdate(
      { username: msg.recipient },
      {
          $push:
              { notifications: notification }
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
          if (!updatedUser) {
              return res.status(404).json({
                  data: null,
                  err: null,
                  msg: 'User not found.'
              });
          }
      }
  );

    // return response message

    return res.status(200).json({
      data: msg,
      err1: null,
      msg: 'Message was sent successfully.'
    });
  });
});
};

// get messages stored in the DB
// where the recipient is specified by an input parameter in the URL
module.exports.getInbox = function (req, res, next) {

  Message.find({ recipient: req.params.user }).sort({ sentAt: -1 }).
    exec(function (err, msgs) {
      if (err) {
        return next(err);
      }

      return res.status(200).json({
        data: msgs,
        err: null,
        msg: 'Inbox has been retreived successfully.'
      });
    });
};

// get messages stored in the DB
// where the sender is specified by an input parameter in the URL
module.exports.getSent = function (req, res, next) {

  Message.find({ sender: req.params.user }).sort({ sentAt: -1 }).
    exec(function (err, msgs) {
      if (err) {
        return next(err);
      }

      return res.status(200).json({
        data: msgs,
        err: null,
        msg: 'Sent messages have been retreived successfully.'
      });
    });
};

// delete a message from the DB
module.exports.deleteMessage = function (req, res, next) {
  // find the message by its id, then delete it
  Message.remove({ _id: req.params.id }, function (err, msg) {
    if (err) {
      return next(err);
    }

    // return response message
    return res.status(200).json({
      data: msg,
      err: null,
      msg: 'Message deleted successfully.'
    });
  });
};

module.exports.block = function (req, res, next) {
  var blocked = req.params.blocked;
  //  console.log('username of blocked: ', blocked);
  // console.log('CONT. ID of user is: ', req.body._id);
  User.findByIdAndUpdate(
    req.body._id, { $push: { 'blocked': blocked } },
    { new: true }, function (err, updatedob) {
      if (err) {
        //       console.log('entered the error stage of update');

        return res.status(402).json({
          data: null,
          msg: 'error occurred during addition of blocked user to array , user is:' +
            req.body.username + 'Blocked is: ' + blocked
        });
      }
      //     console.log('status is 200');

      return res.status(200).json({
        data: updatedob,
        err: null,
        msg: 'Blocked user'
      });
    }
  );
};

// get recently contacted users
module.exports.getRecentlyContacted = function (req, res, next) {

  Message.aggregate([
    // get records where sender is equal to the input parameter user
    { $match: { sender: req.params.user } },
    {
      // group records by recipient and most recent sentAt date
      $group: {
        _id: '$recipient',
        recipientAvatar: { $addToSet: '$recipientAvatar' },
        sentAt: { $max: '$sentAt' }
    }
   },
   // order records descendingly by sentAt
   { $sort: { sentAt: -1 } },
   // get the first 5 elements
   { $limit: 5 }
  ]).exec(function(err, users) {
    if (err) {
      return next(err);
    }

      // console.log(users);
      return res.status(200).json({
        data: users,
        err: null,
        msg: 'Success.'
      });
    });
};

module.exports.contactAdmin = function (req, res, next) {
 User.find({ 'isAdmin': true }, function (err, users) {
    if (err) {
      return next(err);
    } else if (users) {
      for (var num = 0; num < users.length; num += 1) {
        req.body.recipient = users[num].username;
        Message.create(
          req.body
          , function (error, posted) {
            if (err) {
              return next(err);
            }
          }
        );
      }

      return res.status(200).json({
        data: null,
        err: null,
        msg: 'Message Sent!'
      });
    }
  });
};

//modified unBlock method (correct version)
module.exports.unBlock = function (req, res, next) {
  var ID = req.params.id;
  //var array =req.body.data.blocked;
  // console.log('req.body.data',req.body.data.blocked );
  //console.log('unBlock CONT. ID of user is: ', req.params.id);
  //console.log('blocklist is ', req.body);

  User.findByIdAndUpdate(
    ID, { $set: { 'blocked': req.body } },
    { new: true }, function (err, updatedob) {
      if (err) {
        // console.log('entered the error stage of update');

        return res.status(402).json({
          data: null,
          msg: 'error occurred during unblocking the user'
        });
      }

      return res.status(200).json({
        data: updatedob,
        err: null,
        msg: 'This user is no longer blocked'
      });
    }
    // end function
  );
};

module.exports.markAsRead = function(req, res, next) {
  Message.findByIdAndUpdate(
    req.body._id, { $set: { 'state': false } },
    { new: true }, function (err, result) {
      if (err) {
        return res.status(402).json({
          data: null,
          msg: 'error'
        });
      }

      return res.status(200).json({
        data: result,
        err: null,
        msg: 'Message is read'
      });
    }
  );
 };
