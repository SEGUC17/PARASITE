var mongoose = require('mongoose');
var Activity = mongoose.model('Activity');

/* eslint max-statements: ["error", 20] */
/* eslint multiline-comment-style: ["error", "starred-block"] */
/* eslint-disable eqeqeq */

module.exports.getActivities = function (req, res, next) {

    /*
     *  Middleware for retrieving activities
     *
     *  Admin can retrieve all activities while other users
     *  can only retrieve verified activities
     *
     *  @author: Wessam
     */


    var user = req.user;

    var isAdmin = false;
    var status = req.query.status;

    if (user) {
        isAdmin = user.isAdmin;
    }

    var pageN = Number(req.query.page);
    var valid = pageN && !isNaN(pageN);
    if (!valid) {
        pageN = 1;
    }

    /*
     *  Filtering unverified activities
     *  for non Admin users
     *  TODO: adding activities created by the req.user
     */
    var filter = {};
    if (status) {
        filter.status = status;
    }

    if (!isAdmin) {
        filter.status = 'verified';
    }
    Activity.paginate(
        filter,
        {
            limit: 10,
            page: pageN,
            select: { discussion: 0 }
        },
        function (err, activities) {
            if (err) {
                return next(err);
            }
            res.status(200).json({
                data: activities,
                err: null,
                msg: 'Activities retrieved successfully'
            });
        }, {
            columns: {},
            populate: ['creator'],
            sortBy: { createdAt: -1 }
        }
    );
};

module.exports.getActivity = function (req, res, next) {

    /*
     *  Middleware for retrieving an activity
     *
     *  @author: Wessam
     */

    var user = req.user;
    var activityId = req.params.activityId;

    var isAdmin = false;

    if (user) {
        isAdmin = user.isAdmin;
    }

    Activity.findById(activityId).
        populate('bookedBy').
        exec(function (err, activity) {
            if (err) {
                return next(err);
            }
            if (!activity) {
                return res.status(404).json({
                    data: null,
                    err: 'Activity doesn\'t exist',
                    msg: null
                });
            }
            var creatorName = activity.creator;

            if (activity.status !== 'verified') {

                if (!isAdmin && creatorName !== user.username) {
                    return res.status(403).json({
                        data: null,
                        err: 'this activity isn\'t verified yet',
                        msg: null
                    });
                }
            }

            return res.status(200).json({
                data: activity,
                err: null,
                msg: 'activity retrieved successfully'
            });
        });
};


module.exports.postActivity = function (req, res) {

    /*
     *   Middleware for creating an activity
     *
     *   BODY:
     *   {
     *       name : String
     *       description : String
     *       price : Number
     *       fromDateTime : Date | 1522409945
     *       toDateTime : Date | 1522419945
     *       image : String
     *   }
     *
     *   Only verified contributors can create
     *   activities with status = pending
     *   While admins create activities
     *   with status = verified
     *
     *   @author: Wessam
     */

    var user = req.user;

    var isAdmin = false;
    var isVerified = false;

    if (user) {
        isAdmin = user.isAdmin;
        isVerified = user.verified;
    }

    if (!(isAdmin || isVerified)) {
        return res.status(403).json({
            data: null,
            err: null,
            msg: 'Only admins and verified users can create activities.'
        });
    }

    var status = isAdmin ? 'verified' : 'pending';
    // adding status to the body of the request
    req.body.status = status;
    req.body.creator = user.username;

    Activity.create(req.body, function (err, activity) {
        if (err) {
            return res.status(422).json({
                data: null,
                err: err,
                message: null
            });
        }
        res.status(201).json({
            data: activity,
            err: null,
            message: 'Activity created successfully.'
        });
    });
};

module.exports.reviewActivity = function (req, res) {

    /*
     *  Middleware for reviewing an activity by admin
     *
     *  BODY:
     *  {
     *      _id: String | activity id
     *      status: string | verfied || rejected
     *  }
     *
     *  @author: Wessam
     */

    var user = req.user;
    var activityId = req.body._id;
    var newStatus = req.body.status;

    if (!activityId || !newStatus) {
        return res.status(422).json({
            data: null,
            err: 'Activity id and new status must be added to body.',
            msg: null
        });
    }

    var isAdmin = false;

    if (user) {
        isAdmin = user.isAdmin;
    }

    if (!isAdmin) {
        return res.status(403).json({
            data: null,
            err: 'Only an admin can review activities',
            msg: null
        });
    }

    Activity.findByIdAndUpdate(
        activityId,
        { status: newStatus },
        {
            new: true,
            runValidators: true
        },
        function (err, activity) {
            if (err) {
                return res.status(422).json({
                    data: null,
                    err: err,
                    msg: null
                });
            }
            if (!activity) {
                return res.status(404).json({
                    data: null,
                    err: 'Activity doesn\'t exist',
                    msg: null
                });
            }
            res.status(200).send({
                data: activity,
                err: null,
                msg: 'Activity status is updated'
            });
        }
    );
};

module.exports.prepareActivity = function (req, res, next) {

    /*
     *  function to prepare activity for discussion
     *
     * @author: Wessam
     */

    var activityId = req.params.activityId;

    Activity.findById(activityId).
        exec(function (err, activity) {
            if (err) {
                return next(err);
            }
            if (!activity) {
                return res.status(404).json({
                    data: null,
                    err: 'Activity doesn\'t exist',
                    msg: null
                });
            }
            req.object = activity;
            req.verified = activity.status === 'verified';

            return next();
        });
};

// Author: Heidi
module.exports.editActivity = function (req, res, next) {
    var Status = 'pending';
    if (req.user.isAdmin) {
        Status = 'verified';
    }
    // finding activity by id
    Activity.findById(req.params.activityId).exec(function (err, activity) {
        if (err) {
            return next(err);

        }
        // only activity creator can edit his/her own activity
        if (!(activity.creator == req.user.username)) {
            return res.status(403).send({
                data: null,
                err: null,
                msg: 'Action not allowed'
            });
        }
        // if status is booked already it cannot be edited
        if (activity.bookedBy.length == 0) {
            return res.status(403).send({
                data: null,
                err: null,
                msg: 'no edition allowed'
            });
        }
        // updating activity
        Activity.findByIdAndUpdate(req.params.activityId, {
            $set: {
                description: req.body.description,
                fromDateTime: req.body.fromDateTime,
                name: req.body.name,
                price: req.body.price,
                status: Status,
                toDateTime: req.body.toDateTime

            }
        }, { new: true }).exec(function (error, updatedActivity) {
            if (err) {
                return next(err);
            }

            return res.status(200).send({
                data: updatedActivity,
                err: null,
                msg: 'Activity is updated'
            });
        });
    });
};


module.exports.isIndependent = function(req, res, next) {

    /*
     * Middleware for making sure that the user is independent
     *
     * @author: Wessam
     */

    if (req.user.isChild) {
        return res.status(403).json({
            data: null,
            err: 'You have to be independent to complete this action',
            msg: null
        });
    }

    next();
};

