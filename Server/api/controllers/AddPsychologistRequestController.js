var mongoose = require('mongoose'),
  moment = require('moment'),
  Validations = require('../utils/validators'),
  Request = mongoose.model('AddPsychologistRequest');

module.exports.addRequest = function(req, res, next) {
  if(!(typeof req.body.firstName === 'string')) {
   console.log("T.T")
}
  var valid =
    req.body.firstName &&
    req.body.lastName &&
    req.body.email;
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'firstName(String) lastName(String) and email(String) are required fields.',
      data: null
    });
  }

  Request.create(req.body, function(err, request) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      err: null,
      msg: 'Request was created successfully.',
      data: request
    });
  });
};
