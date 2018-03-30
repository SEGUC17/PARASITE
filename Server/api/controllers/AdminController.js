var mongoose = require('mongoose');
var ContentRequest = mongoose.model('ContentRequest');
var VCR = require('../models/VerifiedContributerRequest');

module.exports.test = function(req, res) {
    res.status(200).json({
        data: 'Perfection',
        err: null,
        msg: 'AdminController works!'
    });
};


//module.exports.getContentReqs = function(req, res, next) {
//    ContentRequest.find({}).exec(function(err, contentRequests) {
//      if (err) {
//        return next(err);
//      }
//      res.status(200).json({
//        data: contentRequests,
//        err: null,
//        msg: 'Products retrieved successfully.'
//      });
//    });
//  };

module.exports.getVCRs = function(req, res, next) {
    var allVCRs = VCR.getAll();

    res.status(200).json({
        err: null,
        msg: 'Products retrieved successfully.',
        data: allVCRs
    });
};