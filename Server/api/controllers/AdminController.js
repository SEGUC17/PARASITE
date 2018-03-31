var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nawwar');
var ContentRequest = mongoose.model('ContentRequest');
var VCR = require('../models/VerifiedContributerRequest');

module.exports.test = function(req, res) {
    res.status(200).json({
        data: 'Perfection',
        err: null,
        msg: 'AdminController works!'
    });
};

         //-------------------------------------------//


module.exports.viewPendingContReqs = function(req, res, next) {
   mongoose.connection.collection('ContentRequest').find({}).
   toArray(function(err, contentRequests) {
     if (err) {
       return next(err);
     }
     console.log(contentRequests);
     var pendingContentRequests = contentRequests.filter(function(pending) {
        return pending.status === ' pending ';
    });
     console.log(pendingContentRequests);
     res.status(200).json({
       data: contentRequests,
       err: null,
       msg: 'Pending Requests retrieved successfully.'
     });
   });
 };
         //-------------------------------------------//

 module.exports.respondContentRequest = function(req, res, next) {
     mongoose.connection.collection('ContentRequest').
      findByIdAndUpdate(
      req.params.ContentRequestId,
      {
          $set: {
          status: req.body
        }
      },
      { new: true }
    ).toArray(function(err, updatedContentRequest) {
      if (err) {
        return next(err);
      }
      if (!updatedContentRequest) {
        return res.status(404).json({
            data: null,
            err: null,
            msg: 'ContentRequest not found.'
             });
      }
      res.status(200).json({
        data: updatedContentRequest,
        err: null,
        msg: 'ContentRequest was ' +
        updatedContentRequest.status + ' successfully.'
      });
    });
  };

         //-------------------------------------------//
module.exports.getVCRs = function(req, res, next) {
    var allVCRs = VCR.getAll();

    res.status(200).json({
        err: null,
        msg: 'VCRs retrieved successfully.',
        data: allVCRs
    });
};
