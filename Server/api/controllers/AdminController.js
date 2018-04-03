/* eslint no-underscore-dangle: ["error", {"allow" : ["_id" , "_now"]}] */
var moment = require('moment');
var mongoose = require('mongoose');
var ContentRequest = mongoose.model('ContentRequest');
var VCR = require('../models/VerifiedContributerRequest');
var Content = mongoose.model('Content');
var User = mongoose.model('User');
mongoose.set('debug', true);
User = mongoose.model('User');


//ISAdmin?
module.exports.viewPendingContReqs = function (req, res, next) {
    console.log('my user name is: ' + req.user.username);
    console.log('Am I an admin ' + req.user.isAdmin);

    ContentRequest.find({}).
        exec(function (err, contentRequests) {
            if (err) {
                return next(err);
            }
            if (!req.user.isAdmin) {
                console.log(req.user.isAdmin);

                return res.status(403).json({
                    data: null,
                    err: 'Unauthorized action',
                    msg: null

                });
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
//ISAdmn?
module.exports.respondContentRequest = function (req, res, next) {

    ContentRequest.findByIdAndUpdate(
        req.params.ContentRequestId,
        {
        $set:
        {
            status: req.body.str,
            updatedOn: moment().toDate()
        }
},
        { new: true },
        function (err, updatedcontentrequest) {
            if (!mongoose.Types.ObjectId.isValid(req.params.ContentRequestId)) {
                return res.status(422).json({
                    data: null,
                    err: 'The Content Id is not valid.',
                    msg: null
                });
            }
            if (err) {
                console.log('cannot ' + req.body.str);

                return next(err);
            }
            if (!req.user.isAdmin) {
                return res.status(403).json({
                    data: null,
                    err: 'Unauthorized action',
                    msg: null

                });
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
//ISAdmn?

module.exports.respondContentStatus = function (req, res, next) {

    Content.findByIdAndUpdate(
         req.params.ContentId,
        {
            $set: {
            approved: req.body.str,
            touchDate: moment().toDate()
        }
    },
        { new: true },
        function (err, updatedContent) {
            if (!mongoose.Types.ObjectId.isValid(req.params.ContentId)) {
                return res.status(422).json({
                    data: null,
                    err: 'The Content Id is not valid.',
                    msg: null
                });
            }
            if (err) {
                console.log('cannot set it to' + req.body.str);

                return next(err);
            }
            if (!req.user.isAdmin) {
                return res.status(403).json({
                    data: null,
                    err: 'Unauthorized action',
                    msg: null

                });
            }


            if (!updatedContent) {
                return res.status(404).json({
                    data: null,
                    err: 'Content not found',
                    msg: null
                });
            }

            return res.status(200).json({
                data: updatedContent,
                err: null,
                msg: updatedContent.title +
                    ' is now ' + req.body.str
            });
        }
    );
};

