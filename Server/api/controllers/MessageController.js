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

// add a message to the messages collection in the DB
module.exports.sendMessage = function(req, res, next) {

  /*var valid =
    req.body.body &&
    Validations.isString(req.body.body) &&
    req.body.sender &&
    Validations.isString(req.body.sender) &&
    req.body.recipient &&
    Validations.isString(req.body.recipient);

    if (!valid) {
    return res.status(422).json({
      data: null,
      err: null,
      msg: 'body and sender and recipient are required fields'
    });
  }*/

  /*User.find({ username: req.body.recipient }).exec(function (err, user) {
    if (err) {
        return next(err);
    }

    if (!user) {
        return res.status(404).json({
            data: null,
            err: 'This user does not exist.',
            msg: null
        });
    }

    res.status(200).json({
        data: user,
        err: null,
        msg: 'User exists.'
    });
});*/

  // Security Check
  delete req.body.sentAt;

  // create new entry in DB
  Message.create(req.body, function(err, msg) {
    if (err) {
      return next(err);
    }

    // return response message
    return res.status(200).json({
      data: msg,
      err: null,
      msg: 'Message was sent successfully.'
    });
  });
};

// get messages stored in the DB
// where the recipient is specified by an input parameter in the URL
module.exports.getInbox = function(req, res, next) {

  Message.find({ recipient: req.params.user }).sort({ sentAt: -1 }).
  exec(function(err, msgs) {
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
module.exports.getSent = function(req, res, next) {

  Message.find({ sender: req.params.user }).sort({ sentAt: -1 }).
  exec(function(err, msgs) {
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
module.exports.deleteMessage = function(req, res, next) {
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

 module.exports.block = function(req, res, next) {
   var blocked = req.params.blocked;
     console.log('username of blocked: ', blocked);
    console.log('ID of user is: ', req.body._id);
     User.findByIdAndUpdate(
       req.body._id, { $push: { 'blocked': blocked } },
      { new: true }, function (err, updatedob) {
      if (err) {
            console.log('entered the error stage of update');

          return res.status(402).json({
              data: null,
              msg: 'error occurred during addition of blocked user to array , user is:' +
              req.body.username + 'Blocked is: ' + blocked
          });
      }
      console.log('status is 200');
      
      return res.status(200).json({
       data: null,
       err: null,
       msg: 'Blocked user'
      });
  }
 );
};

