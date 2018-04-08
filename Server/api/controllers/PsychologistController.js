
/* eslint-disable max-len */
/* eslint-disable max-statements */

var mongoose = require('mongoose');
var Request = mongoose.model('PsychologistRequest');
var Psychologists = mongoose.model('Psychologist');

module.exports.addRequest = function (req, res, next) {
  var valid =
    req.body.firstName &&
    req.body.lastName &&
    req.body.email;
  if (!valid) {
    return res.status(422).json({
      data: null,
      err: null,
      msg: 'firstName(String) lastName(String) and email(String)' +
        ' are required fields.'
    });
  }

  var user = req.user;

  var isAdmin = false;

  if (typeof user !== 'undefined') {
    isAdmin = user.isAdmin;
  }

  if (isAdmin) {
    Psychologists.create(req.body, function (err, request) {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        data: request,
        err: null,
        msg: 'Psychologist added successfully.'
      });
    });
  } else {
    Request.create(req.body, function (err, request) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: request,
        err: null,
        msg: 'Request was created successfully.'
      });
    });
  }
};

module.exports.getPsychologists = function (req, res, next) {
  console.log('got psychs');
  Psychologists.find({}).exec(function (err, psychs) {
    if (err) {
      return next(err);
    }
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

    // Ensure the request still exists
    Request.findById(req.body._id).exec(function (err, psychReq) {
      if (err) {
        return next(err);
      }
      if (!psychReq) {
        return res.status(404).json({
          data: null,
          err: null,
          msg: 'Request not found.'
        });
      }
      // If found, make the newPsych to insert
      var newPsych = {
        address: req.body.address,
        daysOff: req.body.daysOff,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        priceRange: req.body.priceRange
      };
      // Delete the request
      Request.deleteOne({ _id: req.body._id }, function (err1, product) {
        if (err1) {
          return next(err1);
        }
        // Insert the Psychologist
        Psychologists.create(newPsych, function (err2, prod) {
          if (err2) {
            return next(err2);
          }
          res.status(201).json({
            data: newPsych,
            err: null,
            msg: 'Request accepted and psychologist added to database.'
          });
        });
      });
    });
  } else {
    // Simply delete the request and notify the applicant
    Request.findByIdAndRemove(req.body._id, function (err, psych) {
      if (err) {
        return next(err);
      }
      // TODO Notify applicant

      // When done, send response
      return res.status(200).json({
        data: psych,
        err: null,
        msg: 'Request rejected and applicant notified.'
      });
    });
  }
};
