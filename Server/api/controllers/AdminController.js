/* eslint no-underscore-dangle: ["error", {"allow" : ["_id"]}] */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nawwar');
var ContentRequest = mongoose.model('ContentRequest');
var VCR = require('../models/VerifiedContributerRequest');

module.exports.viewPendingContReqs = function (req, res, next) {
    ContentRequest.find({}).
        exec(function (err, contentRequests) {
            if (err) {
                return next(err);
            }
            var pendingContentRequests = contentRequests.
                filter(function (pending) {
                    return pending.status === 'pending';
                });
            res.status(200).json({
                data: pendingContentRequests,
                err: null,
                msg: 'Pending Requests retrieved successfully.'
            });
        });
};
//-------------------------------------------//
module.exports.getVCRs = function (req, res, next) {
    var allVCRs = VCR.getAll();
    res.status(200).json({
        data: allVCRs,
        err: null,
        msg: 'VCRs retrieved successfully.'
    });
};

module.exports.respondContentRequest = function (req, res, next) {
    ContentRequest.findByIdAndUpdate(
        req.params.ContentRequestId,
        { $set: { status: req.body.str } },
        { new: true },
        function (err, updatedcontentrequest) {
            if (err) {
                console.log('cannot ' + req.body.str);

                return next(err);
            }

            if (!updatedcontentrequest) {
                return res.status(404).json({
                    data: null,
                    err: 'Request not found',
                    msg: null
                });
            }

            return res.status(200).json({
                data: updatedcontentrequest,
                err: null,
                msg: updatedcontentrequest.contentTitle +
                    ' request is now ' + req.body.str
            });
        }
    );
};
