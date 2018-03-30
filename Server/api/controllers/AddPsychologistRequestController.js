var mongoose = require('mongoose'),
  moment = require('moment'),
//  Validations = require('../utils/Validations'),
  Request = mongoose.model('AddPsychologistRequest');

module.exports.addRequest = function(req, res, next) {
 /* var valid =
    req.body.firstName &&
    Validations.isString(req.body.firstName) &&
    req.body.lastName &&
    req.body.email &&
    Validations.isNumber(req.body.phone);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'firstName(String) lastName(String) and email(String) are required fields.',
      data: null
    });
  }*/

  Request.create(req.body, function(err, request) {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.status(201).json({
      err: null,
      msg: 'Request was created successfully.',
      data: request
    });
  });
};
