/* eslint-disable */
var mongoose = require('mongoose'),
  moment = require('moment'),
  Validations = require('../utils/validators'),
  Request = mongoose.model('PsychologistRequest'),
  Psychologists = mongoose.model('Psychologist');

module.exports.addRequest = function (req, res, next) {
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
  Request.create(req.body, function (err, request) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      err: null,
      msg: 'Request was created successfully.',
      data: request
    });
  });
}

module.exports.getPsychologists = function (req, res, next) {
  console.log('got psychs');
  Psychologists.find({}).exec(function (err, psychs) {
    console.log(psychs);
    res.status(200).json({
      data: psychs,
      err: null,
      msg: 'Psychologists retrieved successfully.'
    });
  });
};

module.exports.getRequests = function (req, res, next) {
  console.log('Got here');
  Request.find({}).exec(function (err, requests) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      data: requests,
      err: null,
      msg: 'Requests retrieved successfully.'
    });
  });
};

module.exports.evaluateRequest = function (req, res, next) {
  if (req.body.result) {
    console.log('Got here, True');
    var newPsych;

    // Ensure the request still exists
    Request.findById(req.body._id).exec(function (err, psychReq) {
      if (err) {
        return next(err);
      }
      if (!psychReq) {
        return res
          .status(404)
          .json({ err: null, msg: 'Request not found.', data: null });
      }
      // If found, make the newPsych to insert
      newPsych = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        daysOff: req.body.daysOff,
        priceRange: req.body.priceRange
      };
      // Delete the request
      Request.deleteOne({ _id: req.body._id }, function (err, product) {
        if (err) {
          return next(err);
        }
        // Insert the Psychologist
        Psychologists.create(newPsych, function (err, product) {
          if (err) {
            return next(err);
          }
          res.status(201).json({
            err: null,
            msg: 'Request accepted and psychologist added to database.',
            data: newPsych
          });
        });
      })
    });
  }
  else {
    console.log(req.body._id);

    // Simply delete the request and notify the applicant
    Request.findByIdAndRemove(req.body._id, function (err, psych) {
      if (err) {
        return next(err);
      }
      // TODO Notify applicant

      // When done, send response
      return res.status(200).json({
        err: null,
        msg: 'Request rejected and applicant notified.',
        data: psych
      });
    })
  }
};
