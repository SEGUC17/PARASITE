/* eslint no-underscore-dangle: ["error", {"allow" : ["_id" , "_now"]}] */
/* eslint-disable */
var moment = require('moment');
var mongoose = require('mongoose');
var ContentRequest = mongoose.model('ContentRequest');
var StudyPlanPublishRequest = mongoose.model('StudyPlanPublishRequest');
var VCR = require('../models/VerifiedContributerRequest');
var Content = mongoose.model('Content');
var StudyPlan = mongoose.model('StudyPlan');
var User = mongoose.model('User');
var VCRmodel = mongoose.model('VerifiedContributerRequest');
var userModel = mongoose.model('User');

// get all pending contentRequests
module.exports.viewPendingContReqs = function (req, res, next) {
    // find All entries in DB
    ContentRequest.find({}).
    exec(function (err, contentRequests) {
        if (err) {
            return next(err);
        }
        // if not admin return error
        if (!req.user.isAdmin) {
            console.log(req.user.isAdmin);

            return res.status(403).json({
                data: null,
                err: 'Unauthorized action',
                msg: null

            });
        }
        // filter by status=pending & type(Idea/resource) from the URL
        var pendingContentRequests = contentRequests.
        filter(function (pending) {
            return pending.status === 'pending' &&
                pending.contentType === req.params.type;
        });
        // return 200 if everything is OK

        return res.status(200).json({
            data: pendingContentRequests,
            err: null,
            msg: 'Pending ' +
                req.params.type +
                ' requests retrieved successfully.'
        });
    });
};

// view all pending study plan publish requests
module.exports.viewStudyPlanPublishReqs = function (req, res, next) {
    StudyPlanPublishRequest.find({}).
    exec(function (err, studyPlanPubRequests) {
        if (err) {
            return next(err);
        }
        if (!req.user.isAdmin) {
            return res.status(403).json({
                data: null,
                err: 'Unauthorized action',
                msg: null

            });
        }
        // filter by status=pending
        var pendingstudyPlanPubRequests = studyPlanPubRequests.
        filter(function (pending) {
            return pending.status === 'pending';
        });

        return res.status(200).json({
            data: pendingstudyPlanPubRequests,
            err: null,
            msg: 'Pending study requests retrieved successfully.'
        });
    });
};
// respond to a single contentRequest
module.exports.respondStudyPlanPublishRequest = function (req, res, next) {
    StudyPlanPublishRequest.findByIdAndUpdate(
        req.params.StudyPlanPubRequestId, {
            $set: {
                status: req.body.str,
                updatedOn: moment().toDate()
            }
        }, { new: true },
        function (err, updatedStudyPlanPubRequest) {
            // check if the id in the URL is valid, if not return error
            if (!mongoose.Types.ObjectId.
                isValid(req.params.StudyPlanPubRequestId)) {
                return res.status(422).json({
                    data: null,
                    err: 'The Request Id is not valid',
                    msg: null
                });
            }
            if (err) {
                console.log('cannot ' + req.body.str);

                return next(err);
            }
            // if not admin return error
            if (!req.user.isAdmin) {
                return res.status(403).json({
                    data: null,
                    err: 'Unauthorized action',
                    msg: null

                });
            }
            // if not found return error
            if (!updatedStudyPlanPubRequest) {
                return res.status(404).json({
                    data: null,
                    err: 'Request not found',
                    msg: null
                });
            }
            // return 200 if everything is OK


            return res.status(200).json({
                data: updatedStudyPlanPubRequest,
                err: null,
                msg: updatedStudyPlanPubRequest.title +
                    ' request is now ' + req.body.str
            });
        }
    );
};
// remove a published study plan
module.exports.removePublishedStudyPlans = function (req, res, next) {
    StudyPlan.findById(
        {
            published: true,
            studyPlanID: req.params.studyPlanID
        },
         function (err, studyPlans) {
            if (err) {
                return next(err);
        }
        // if the user is not an admin return an error
        if (!req.user.isAdmin) {
            return res.status(403).json({
                data: null,
                err: 'Unauthorized action',
                msg: null

            });
        }
        //if he is an admin remove the study plan
        StudyPlan.findByIdAndRemove(
             {
                 published: true,
                 studyPlanID: req.params.studyPlanID
             },
            function (err2) {
                if (err2) {
                    return next(err2);
                }
            }
        );
        // send an ok message

        return res.status(200).json({
            data: null,
            err: null,
            msg: 'Study Plan removed successfully'
        });
    }
);
};
// respond to a single contentRequest
module.exports.respondContentRequest = function (req, res, next) {
    // find this request by id from the URL
    ContentRequest.findByIdAndUpdate(
        req.params.ContentRequestId, {
            $set: {
                // update certain values (status/updatedOn)
                // with an object sent from frontEnd
                status: req.body.str,
                updatedOn: moment().toDate()
            }
        }, { new: true },
        function (err, updatedcontentrequest) {
            // if ContentRequestId is not valid return error
            if (!mongoose.Types.ObjectId.isValid(req.params.ContentRequestId)) {
                return res.status(422).json({
                    data: null,
                    err: 'The Request Id is not valid',
                    msg: null
                });
            }
            if (err) {

                return 'cannot update request';

            }
            // if the request is not  found return error
            if (!updatedcontentrequest) {
                return res.status(404).json({
                    data: null,
                    err: 'Request not found',
                    msg: null
                });
            }
            // if ContentId is not valid return error

            if (!mongoose.Types.ObjectId.isValid(req.params.ContentId)) {
                return res.status(422).json({
                    data: null,
                    err: 'The Content Id is not valid',
                    msg: null
                });
            }
            //Update the content to approved
            Content.findByIdAndUpdate(
                req.params.ContentId,
                {
                    $set: {
                        // update certain values (approved/touchDate)
                        // with an object sent from frontEnd
                        approved: req.body.approved,
                        touchDate: moment().toDate()
                    }
                },
                { new: true },
                function (err, content) {
                    if (err) {
                        console.log(err);
                    }
                    if (!Content) {
                        return res.status(404).json({
                            data: null,
                            err: 'Content not found',
                            msg: null
                        });
                    }

                }
            );
            if (req.body.approved == true) {
                //give the user extra 10 points
            User.findOneAndUpdate(
                { 'username': req.body.userName },
                { $set: { contributionScore: req.body.oldScore + 10 } },
                { new: true },
                function (err, User) {

                    if (err) {
                            req.body.username;
                    }
                    // if not found return error
                    if (!User) {
                        return res.status(404).json({
                            data: null,
                            err: 'User not found',
                            msg: null
                        });
                    }
                }
            );
        }

return res.status(200).json({
                data: updatedcontentrequest,
                err: null,
                msg: updatedcontentrequest.contentTitle +
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
            VCRmodel.
            find({}).
            exec(function (err, result) {
                if (err) {
                    throw err;
                }
                // filters the result by the given filter
                filteredVCRs = result.filter(function (request) {
                    return request.status === req.params.FilterBy;
                });

                console.log(filteredVCRs);

                return res.status(200).json({
                    data: { dataField: filteredVCRs },
                    err: null,
                    msg: 'VCRs retrieved successfully.'
                });


            });
        } catch (err) {
            console.log(err);
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
             { $set: { status: req.body.responce } }, { new: false },
            function (err) {
                if (err) {
                    throw err;
                }
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

                // Updating verified by Approved.
                userModel.update(
                    { _id: userId }, { $set: { verified: true } },
                     { new: true },
                    function (error, resp) {
                        if (error) {
                            throw error;
                        }
                        res.status(200).json({
                            data: null,
                            err: null,
                            msg: 'reponse has been submitted'
                        });
                    }
                );
            }
            if (req.body.responce === 'disapproved') {
                // Updating verified by disapproved.
                userModel.update(
                    { _id: userId }, { $set: { verified: false } },
                     { new: true },
                    function (error, resp) {
                        if (error) {
                            throw error;
                        }
                        res.status(200).json({
                            data: null,
                            err: null,
                            msg: 'reponse has been submitted'
                        });
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
