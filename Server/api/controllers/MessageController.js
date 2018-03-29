var mongoose = require('mongoose'),
  moment = require('moment'),
  Validations = require('../utils/validators'),
  Message = mongoose.model('Message');

module.exports.sendMessage = function(req, res, next) {
  var valid =
    req.body.body &&
    Validations.isString(req.body.body) &&
    req.body.sender &&
    Validations.isString(req.body.sender)&&
    req.body.recipient &&
    Validations.isString(req.body.recipient);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'body(String) and sender(String) and recipient(String) are required fields.',
      data: null
    });
  }
  
  // Security Check
  delete req.body.sentAt;

  Message.create(req.body, function(err, msg) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      err: null,
      msg: 'Message was sent.',
      data: msg
    });
  });
};