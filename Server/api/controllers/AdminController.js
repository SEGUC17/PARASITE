/* eslint no-underscore-dangle: ["error", {"allow" : ["_id"]}] */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nawwar');
var ContentRequest = mongoose.model('ContentRequest');
var VCR = require('../models/VerifiedContributerRequest');
var Content = mongoose.model('Content');

var VCRmodel = mongoose.model('VerifiedContributerRequest');
var userModel = mongoose.model('User');

mongoose.connect('mongodb://localhost/nawwar');
mongoose.set('debug', true);


         //-------------------------------------------//
         //-------------------------------------------//

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

         //-------------------------------------------//

// @author: Maher
// getVCRs: gets all the requests of the unverified
// contribters filtered by the given filter in the url.

module.exports.getVCRs = function(req, res, next) {
    var filteredVCRs = null;
    // Checks if Admin.
    if (req.user.isAdmin) {

        try {
            mongoose.connection.collection('VerifiedContributerRequest').find({}).
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


module.exports.VCRResponde = function(req, res, next) {
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
