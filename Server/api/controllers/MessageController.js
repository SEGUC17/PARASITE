var mongoose = require('mongoose');
var moment = require('moment');
var Validations = require('../utils/validators');
var models = require('../models/Message');
var Message = mongoose.model('Message');

module.exports.sendMessage = function(req, res, next) {

  var valid =
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
  }

  // Security Check
  delete req.body.sentAt;

  Message.create(req.body, function(err, msg) {
    if (err) {
      return next(err);
    }

    return res.status(201).json({
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

