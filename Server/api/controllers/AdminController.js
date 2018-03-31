/* eslint no-underscore-dangle: ["error", {"allow" : ["_id"]}] */

var mongoose = require('mongoose');
mongoose.set('debug', true);
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
        return pending.status === 'pending';
    });
     console.log(pendingContentRequests);
     res.status(200).json({
       data: pendingContentRequests,
       err: null,
       msg: 'Pending Requests retrieved successfully.'
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

module.exports.respondContentRequest = function(req, res, next) {
    console.log('inside function respond in server');
    console.log('this is my body' + req.body.str);
    ContentRequest.findByIdAndUpdate(
    req.params.ContentRequestId,
    { $set: { status: req.body.str } },
    { new: true },
    function(err, updatedcontentrequest) {
        if (err) {
            console.log('cannot ' + req.body.str);

            return next(err);
        }

        return res.status(200).json({
            data: updatedcontentrequest,
            err: null,
            msg: 'The request is now ' + req.body.str
        });
    }
);
};
