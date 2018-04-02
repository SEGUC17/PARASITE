/* eslint no-underscore-dangle: ["error", {"allow" : ["_id"]}] */
var dateTime = require('node-datetime');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nawwar');
var ContentRequest = mongoose.model('ContentRequest');
var VCR = require('../models/VerifiedContributerRequest');
var Content = mongoose.model('Content');
var User = mongoose.model('User');
mongoose.set('debug', true);

module.exports.viewPendingContReqs = function (req, res, next) {
    console.log(req.params.type);
    ContentRequest.find({}).
        exec(function (err, contentRequests) {
            if (err) {
                return next(err);
            }
            var pendingContentRequests = contentRequests.
                filter(function (pending) {
                    return pending.status === 'pending' &&
                    pending.contentType === req.params.type;
                });
            res.status(200).json({
                data: pendingContentRequests,
                err: null,
                msg: 'Pending ' +
                req.params.type +
                ' requests retrieved successfully.'
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
        {
        $set:
        {
            status: req.body.str,
            updatedOn: dateTime.create()._now
        }
},
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

module.exports.respondContentStatus = function (req, res, next) {
    console.log('this is my contentID in params: ' + req.params.ContentId);
    Content.findByIdAndUpdate(
         req.params.ContentId,
        {
            $set: {
            approved: req.body.str,
            touchDate: dateTime.create()._now
        }
    },
        { new: true },
        function (err, updatedContent) {
            if (err) {
                console.log('cannot set it to' + req.body.str);

                return next(err);
            }

            if (!updatedContent) {
                return res.status(404).json({
                    data: null,
                    err: 'Content not found',
                    msg: null
                });
            }
            console.log(updatedContent);

            return res.status(200).json({
                data: updatedContent,
                err: null,
                msg: updatedContent.title +
                    ' is now ' + req.body.str
            });
        }
    );
};

