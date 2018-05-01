/* eslint no-underscore-dangle: ["error", {"allow" : ["_id" , "_now"]}] */
/*eslint max-statements: ["error", 100]*/

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
var Report = mongoose.model('Report');
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
                return res.status(403).json({
                    data: null,
                    err: 'Unauthorized action',
                    msg: null

                });
            }
            var pendingContentRequests = contentRequests.
                filter(function (pending) {
                    return pending.status === 'pending';
                });
            var resresult = pendingContentRequests.
                filter(function (resource) {
                    return resource.contentType === 'resource';
                });
            var idearesult = pendingContentRequests.
                filter(function (idea) {
                    return idea.contentType === 'idea';
                });
            var finalResults = pendingContentRequests;
            var partResults1 = pendingContentRequests;

            // if user unchecks all checkboxes or in the very beginning
            if (req.params.res === req.params.idea) {
                console.log('Neither resource nor idea is checked');
                finalResults = pendingContentRequests;
            } else if (req.params.res === 'true') {
                console.log('Resource is checked');
                partResults1 = resresult;
            } else if (req.params.idea === 'true') {
                console.log('Idea is checked');
                partResults1 = idearesult;
            }
            // both aren't checked or both are checked
            if (req.params.create === req.params.edit) {
                finalResults = partResults1;
            } else if (req.params.create === 'true') {
                console.log('Create is checked');
                finalResults = partResults1.
                    filter(function (create) {
                        return create.requestType === 'create';
                    });
            } else if (req.params.edit === 'true') {
                console.log('Edit is checked');
                finalResults = partResults1.
                    filter(function (edit) {
                        return edit.requestType === 'update';
                    });
            }
            // return 200 if everything is OK

            return res.status(200).json({
                data: finalResults,
                err: null,
                msg: 'Requested requests retrieved successfully.'
            });
        });
};

// view all pending study plan publish requests
module.exports.viewStudyPlanPublishReqs = function (req, res, next) {
    StudyPlanPublishRequest.find({}).
        exec(function (err, studyPlanPublishRequests) {
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
            var pendingstudyPlanPubRequests = studyPlanPublishRequests.
                filter(function (pending) {
                    return pending.status === 'pending';
                });
            console.log('dummy print');

            return res.status(200).json({
                data: pendingstudyPlanPubRequests,
                err: null,
                msg: 'Pending study requests retrieved successfully.'
            });
        });
};

module.exports.respondStudyPlanPublishRequest = function (req, res, next) {
    //start
    StudyPlanPublishRequest.findByIdAndUpdate(
        req.params.studyPlanPublishRequestId, {
            $set: {
                status: req.body.respo,
                updatedOn: moment().toDate()
            }
        }, { new: true },
        function (err, updatedStudyPlanPubRequest) {
            // check if the id in the URL is valid, if not return error
            if (!mongoose.Types.ObjectId.
                isValid(req.params.studyPlanPublishRequestId)) {
                return res.status(422).json({
                    data: null,
                    err: 'The Request Id is not valid',
                    msg: null
                });
            }
            if (err) {
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
            // not tested
            var notification = {
                body: 'Your request to publish the study plan is' +
                    req.body.respo,
                date: moment().toDate(),
                itemId: req.params.studyPlanId,
                type: 'study plan'
            };
            User.findOneAndUpdate(
                { username: updatedStudyPlanPubRequest.creator },
                {
                    $push:
                        { 'notifications': notification }
                }
                , { new: true },
                function (errr, updatedUser) {
                    console.log('add the notification');
                    console.log(updatedUser.notifications);
                    if (errr) {
                        return res.status(402).json({
                            data: null,
                            err: 'error occurred during adding ' +
                                'the notification'
                        });
                    }
                    if (!updatedUser) {
                        return res.status(404).json({
                            data: null,
                            err: null,
                            msg: 'User not found.'
                        });
                    }
                }

            );

            StudyPlan.findByIdAndUpdate(
                req.params.studyPlanId,
                {
                    $set: {
                        published: req.body.published,
                        touchDate: moment().toDate()
                    }
                },
                { new: true },
                function (error, studyPlan) {
                    if (error) {
                        return next(error);
                    }
                    if (!studyPlan) {
                        return res.status(404).json({
                            data: null,
                            err: 'study plan not found',
                            msg: null
                        });
                    }

                }
            );
            // return 200 if everything is OK
            // console.log('eh el arf dah ?');

            return res.status(200).json({
                data: updatedStudyPlanPubRequest,
                err: null,
                msg: updatedStudyPlanPubRequest.title +
                    ' request is now ' + req.body.respo
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
        req.params.ContentRequestId,
        {
            $set:
                {
                    // update certain values (status/updatedOn)
                    // with an object sent from frontEnd
                    status: req.body.str,
                    updatedOn: moment().toDate()
                }
        },
        { new: true },
        function (errReq, updatedcontentrequest) {
            // if ContentRequestId is not valid return error
            if (!mongoose.Types.ObjectId.isValid(req.params.ContentRequestId)) {
                return res.status(422).json({
                    data: null,
                    err: 'The Request Id is not valid',
                    msg: null
                });
            }
            if (errReq) {

                return 'cannot update request';
            }
            if (!req.user.isAdmin) {
                return res.status(403).json({
                    data: null,
                    err: 'Unauthorized action',
                    msg: null

                });
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
                function (errCont, content) {
                    if (errCont) {
                        console.log(errCont);
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
            if (req.body.approved === true) {
                //give the user extra 10 points
                User.findOneAndUpdate(
                    { 'username': req.body.userName },
                    { $set: { contributionScore: req.body.oldScore + 10 } },
                    { new: true },
                    function (errUsr, user) {

                        if (errUsr) {
                            console.log(errUsr);
                        }
                        // if not found return error
                        if (!user) {
                            return res.status(404).json({
                                data: null,
                                err: 'User not found',
                                msg: null
                            });
                        }
                    }
                );

                var notification = {
                    body: 'You request has been approved',
                    date: moment().toDate(),
                    itemId: req.params.ContentId,
                    type: 'content'
                };

                User.findOneAndUpdate(
                    { username: req.body.userName },
                    {
                        $push:
                            { 'notifications': notification }
                    }
                    , { new: true },
                    function (err, updatedUser) {
                        console.log('add the notification');
                        // console.log(updatedUser.notifications);
                        if (err) {
                            return res.status(402).json({
                                data: null,
                                err: 'error occurred during adding ' +
                                    'the notification'
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
    var notification = null;
    // Checks if Admin
    if (req.user.isAdmin) {
      // Update the request with the given responce.
      VCRmodel.update(
        {_id: req.params.targetId},
        {$set: {status: req.body.responce}}, {new: false},
        function (err) {
          if (err) {
            throw err;
          }
        }
      );
      var userId = null;
      VCRmodel.find({_id: req.params.targetId}).exec(function (err, result) {
        // find the _id of the Approved/Disapproved User
        // to change his Verified state.
        if (err) {
          throw err;
        }
        userId = result[0].creator[0];
        var response = req.body.responce;

        userModel.findOneAndUpdate(
          {_id: userId}, {$set: {verified: (response === 'approved')}},
          {new: true},
          function (error, resp) {
            if (error) {
              throw error;
            }
            res.status(200).json({
              data: resp,
              err: null,
              msg: 'reponse has been submitted'
            });
          }
        );
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
// Get the user reports
module.exports.getReports = function (req, res, next) {
    Report.find().exec(function (err, report) {
        if (err) {
            return next(err);
        }

        return res.status(200).json({
            data: report,
            err: null,
            msg: ' Reports retrieved successfully.'
        });
    });
};

module.exports.banUser = function (req, res, next) {
    User.findOneAndUpdate(
        { username: req.params.username },
        { $set: { isBanned: true } }, { new: true },
        function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(404).json({
                    data: null,
                    err: null,
                    msg: 'User not found.'
                });
            }

            return res.status(200).json({
                data: user,
                err: null,
                msg: 'User banned successfully'
            });
        }
    );
};

module.exports.deleteReport = function (req, res, next) {
    Report.remove({ _id: req.params.reportId }).
        exec(function (removeError) {
            if (removeError) {
                return next(removeError);
            }
            res.status(200).json({
                data: null,
                err: null,
                msg: 'Report was deleted successfully'
            });
        });
};

