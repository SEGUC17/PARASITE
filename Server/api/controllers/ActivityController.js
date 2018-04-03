var mongoose = require('mongoose');
var auth = require('basic-auth');
var Activity = mongoose.model('Activity');
var User = mongoose.model('User');

/*eslint max-statements: ["error", 20]*/
/* eslint multiline-comment-style: ["error", "starred-block"] */

module.exports.getActivities = function (req, res, next) {

    /*
     *  Middleware for retrieving activities
     *
     *  Admin can retrieve all activities while other users
     *  can only retrieve verified activities
     *
     *  @author: Wessam
     */


    var userId = req.user._id;

    var isAdmin = false;
    var status = req.query.status;

    if (userId) {
        var user = User.findById(userId);
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
        filter, {
        limit: 10,
         page: pageN
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

    var userId = req.user._id;
    var activityId = req.params.activityId;

    var isAdmin = false;

    if (userId) {
        var user = User.findById(userId);
        isAdmin = user.isAdmin;
    }

    Activity.findById(activityId, function (err, activity) {
        if (err) {
            return next(err);
        }
        var creatorId = activity.creator;
        var creator = User.findById(creatorId);
        activity.creator = creator;

        console.log(activity.status);
        if (activity.status !== 'verified') {

            if (!isAdmin || creatorId !== userId) {
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


module.exports.postActivity = function (req, res, next) {

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

    var userId = req.user._id;

    var isAdmin = false;
    var isVerified = false;

    if (userId) {
        var user = User.findById(userId);
        isAdmin = user.isAdmin;
        isVerified = user.isVerified;
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

    Activity.create(req.body, function (err, activity) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            data: activity,
            err: null,
            message: 'Activity created successfully.'
        });
    });
};

module.exports.reviewActivity = function (req, res, next) {

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

    var userId = req.user._id;
    var activityId = req.body.get('_id');
    var newStatus = req.body.get('status');

    if (!activityId || !newStatus) {
        return res.status(422).json({
            data: null,
            err: 'Activity id and new status must be added to body.',
            msg: null
        });
    }

    var isAdmin = false;

    if (userId) {
        var user = User.findById(userId);
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
        function(err, activity) {

            if (err) {
                return next(err);
            }
            res.status(204).json({
                data: activity,
                err: null,
                msg: 'Activity status is updated'
            });
        }
    );
};
