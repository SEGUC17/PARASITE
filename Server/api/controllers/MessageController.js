var mongoose = require('mongoose');
var moment = require('moment');
var Validations = require('../utils/validators');
var models = require('../models/Message');
var Message = mongoose.model('Message');
var User = mongoose.model('User');

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

  Message.create(req.body, function(err, msg) {
    if (err) {
      return next(err);
    }

    return res.status(200).json({
      data: msg,
      err: null,
      msg: 'Message was sent successfully.'
    });
  });
};

module.exports.getInbox = function(req, res, next) {

  Message.find({ recipient: req.params.user }).exec(function(err, msgs) {
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

module.exports.getSent = function(req, res, next) {

  Message.find({ sender: req.params.user }).exec(function(err, msgs) {
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

module.exports.deleteMessage = function(req, res, next) {
  Message.remove({ _id: req.params.id }, function (err, msg) {
    if (err) {
      return next(err);
    }

    return res.status(200).json({
      data: msg,
      err: null,
      msg: 'Message deleted successfully.'
      });
  });
 };

