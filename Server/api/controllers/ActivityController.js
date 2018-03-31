var mongoose = require('mongoose'),
    auth = require('basic-auth'),
    Activity = mongoose.model('Activity'),
    User = mongoose.model('User');



module.exports.getActivities = function (req, res, next) {
    /*
        Middleware for retrieving activities

        Admin can retrieve all activities while other users 
        can only retrieve verified activities

        @author: Wessam
    */


    var user_id = req.sender;

    var isAdmin = false;

    if (user_id) {
        user = User.findById(user_id);
        isAdmin = user.isAdmin;
    }

    var pageN = Number(req.query.page);
    var valid = pageN && (!isNaN(pageN));
    if (!valid) {
        pageN = 1;
    }
    // Filtering unverified activities
    // for non Admin users
    // TODO: adding activities created by the req.user
    var filter = {};
    if (!isAdmin) {
        filter.status = 'verified';
    }
    Activity.paginate(filter, { page: pageN, limit: 10 }, function (err, activities) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            err: null,
            msg: "Activities retrieved successfully",
            data: activities
        });
    });
}

module.exports.getActivity = function (req, res, next) {
    /*
        Middleware for retrieving an activity

        @author: Wessam
    */

    var user_id = req.sender;
    var activity_id = req.params.activityId;

    var isAdmin = false;

    if (user_id) {
        user = User.findById(user_id);
        isAdmin = user.isAdmin;
    }

    Activity.findById(activity_id, function (err, activity) {
        if (err) {
            return next(err);
        }
        console.log(activity.status);
        if (activity.status != "verified") {
            //TODO: checking if the user is the activity owner
            if (!isAdmin) {
                return res.status(403).json({
                    err: "this activity isn't verified yet",
                    msg: null,
                    data: null
                });
            }
        }
        return res.status(200).json({
            err: null,
            msg: "activity retrieved successfully",
            data: activity
        });
    })
}



module.exports.postActivity = function (req, res, next) {
    /*
        Middleware for creating an activity

        BODY:
        {
            name : String
            description : String
            price : Number
            fromDateTime : Date | 1522409945
            toDateTime : Date | 1522419945
            image : String
        }

        Only verified contributors can create 
        activities with status = pending
        While admins create activities 
        with status = verified

        @author: Wessam
    */

    var user_id = req.sender;

    var isAdmin = false;
    var isVerified = false;

    if (user_id) {
        user = User.findById(user_id);
        isAdmin = user.isAdmin;
        isVerified = user.isVerified;
    }

    if (!(isAdmin || isVerified)) {
        return res.status(403).json({
            err: null,
            msg: "Only admins and verified users can create activities.",
            data: null
        });
    }

    status = isAdmin ? 'verified' : 'pending';
    // adding status to the body of the request
    req.body.status = status;

    Activity.create(req.body, function (err, activity) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            err: null,
            message: "Activity created successfully.",
            data: activity
        });
    });
}

module.exports.reviewActivity = function (req, res, next){
    /*
        Middleware for reviewing an activity by admin

        BODY:
        {
            _id: String | activity id
            status: string | verfied || rejected
        }

        @author: Wessam
    */

    // NOT TESTED

    var user_id = req.sender;
    var activityId = req.body.get("_id");
    var newStatus = req.body.get("status");

    if(!activityId || ! newStatus){
        return res.status(422).json({
            err: "Activity id and new status must be added to body.",
            msg: null,
            data: null
        })
    }

    var isAdmin = false;

    if (user_id) {
        user = User.findById(user_id);
        isAdmin = user.isAdmin;
    }

    if(!isAdmin){
        return res.status(403).json({
            err: "Only an admin can review activities",
            msg: null,
            data: null
        })
    }

    Activity.findByIdAndUpdate(activityId, {status: newStatus}, function(err, activity){
        if(err){
            return next(err);
        }
        res.status(204).json({
            err: null,
            msg: "Activity status is updated",
            data: activity
        })
    });
}