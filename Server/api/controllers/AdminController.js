/* eslint no-underscore-dangle: ["error", {"allow" : ["_id" , "_now"]}] */
var moment = require('moment');
var mongoose = require('mongoose');
var ContentRequest = mongoose.model('ContentRequest');
var VCR = require('../models/VerifiedContributerRequest');
var Content = mongoose.model('Content');
var User = mongoose.model('User');
var VCRmodel = mongoose.model('VerifiedContributerRequest');
var userModel = mongoose.model('User');

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


//-------------------------------------------//

// @author: Maher
// getVCRs: gets all the requests of the unverified
// contribters filtered by the given filter in the url.

module.exports.getVCRs = function (req, res, next) {
    var filteredVCRs = null;
    // Checks if Admin.
    if (req.user.isAdmin) {

        try {
            mongoose.connection.collection('VerifiedContributerRequest').
                find({}).
                toArray(function (err, result) {
                    if (err) {
                        throw err;
                    }
                    // filters the result by the given filter
                    filteredVCRs = result.filter(function (request) {
                        return request.status === req.params.FilterBy;
                    });
                    console.log('retrieved all VCRs');

                    return res.status(200).json({
                        data: { dataField: filteredVCRs },
                        err: null,
                        msg: 'VCRs retrieved successfully.'
                    });


                });
        } catch (err) {
            res.status(500).json({
                data: null,
                err: null,
                msg: 'VCRs retrieval failed.'
            });
        }
    } else {
        // if the user is not an Admin
        res.status(403).json({
            data: null,
            err: null,
            msg: 'Not an Admin.'
        });
    }
};


// @author: Maher
// VCRResponde allow the Admin user to respond to a specific
// Verification Request (UnVerified Contributer).


module.exports.VCRResponde = function (req, res, next) {
    // Checks if Admin
    if (req.user.isAdmin) {
        // Update the request with the given responce.
        VCRmodel.update(
            { _id: req.params.targetId },
            { $set: { status: req.body.responce } },
            { new: false },
            function (err) {
                if (err) {
                    console.log(err.msg);
                    throw err;
                }
                console.log('1 document updated');
            }
        );


        var userId = null;
        VCRmodel.find({ _id: req.params.targetId }).
            exec(function (err, result) {
                // find the _id of the Approved/Disapproved User
                // to change his Verified state.
                if (err) {
                    throw err;
                }
                userId = result[0].creator;
                if (req.body.responce === 'approved') {
                    console.log('approving user');

                    // Updating verified by Approved.
                    userModel.update(
                        { _id: userId },
                        { $set: { verified: true } },
                        { new: true },
                        function (error, resp) {
                            if (error) {
                                throw error;
                            }
                            console.log('1 User approved updated');
                        }
                    );
                }
                if (req.body.responce === 'disapproved') {
                    console.log('disapproving user');
                    // Updating verified by disapproved.
                    userModel.update(
                        { _id: userId },
                        { $set: { verified: false } },
                        { new: true },
                        function (error, resp) {
                            if (error) {
                                throw error;
                            }
                            console.log('1 User disapproved updated');
                        }
                    );
                }

            });
    } else {
        // if not Admin.
        res.status(403).json({
            data: null,
            err: null,
            msg: 'Not an Admin'
        });
    }
};
