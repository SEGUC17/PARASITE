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

    Activity.findById(activityId, function (err, activity) {
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
     *  Endpoint to retreive comments detail of activity
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

module.exports.postActivityCommentReply = function (req, res, next) {

    /*
     *  Endpoint for commenting on activities
     *
     * @author: Wessam
     */

    var user = req.user;
    var activityId = req.params.activityId;
    var commentId = req.params.commentId;

    var filter = { _id: activityId };

    if (!user.isAdmin) {
        filter = {
            $and: [
                filter,
                {
                    $or: [
                        { status: 'verified' },
                        { creator: user.username }
                    ]
                }
            ]
        };
    }

    Activity.findOne(filter, function (err, activity) {
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

        var comment = activity.discussion.filter(function (com) {
            return com._id == commentId;
        }).pop();
        if (!comment) {
            return res.status(404).json({
                data: null,
                err: 'Comment doesn\'t exist',
                msg: null
            });
        }

        comment.replies.push({
            creator: user.username,
            text: req.body.text
        });

        activity.save(function (err2) {
            if (err2) {
                return res.status(422).json({
                    data: null,
                    err: 'reply can\'t be empty',
                    msg: null
                });
            }

            return res.status(201).json({
                data: comment.replies.pop(),
                err: null,
                msg: 'reply created successfully'
            });
        });

    });
};

module.exports.deleteActivityComment = function (req, res, next) {

    /*
     *  Endpoint to remove a comment from an activity
     *
     * @author: Wessam
     */

    var user = req.user;
    var activityId = req.params.activityId;
    var commentId = req.params.commentId;

    Activity.findById(activityId, function (err, activity) {
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

        var isActivityCreator = user.username === activity.creator;

        var comment = activity.discussion.filter(function (comm) {
            return comm._id == commentId;
        }).pop();

        if (!comment) {
            return res.status(404).json({
                data: null,
                err: 'Comment doesn\'t exist',
                msg: null
            });
        }

        var isCommentCreator = comment.creator === user.username;

        if (!user.isAdmin && !isActivityCreator && !isCommentCreator) {
            return res.status(403).json({
                data: null,
                err: 'You can\'t delete this comment',
                msg: null
            });
        }

        comment.remove();

        activity.save(function (err2) {
            if (err2) {
                return next(500);
            }

            return res.status(204).json({
                data: null,
                err: null,
                msg: 'comment deleted successfully'
            });
        });
    });
};

module.exports.deleteActivityCommentReply = function (req, res, next) {

    /*
     *  Endpoint to retreive comments detail of activity
     *
     * @author: Wessam
     */

    var user = req.user;
    var activityId = req.params.activityId;
    var commentId = req.params.commentId;
    var replyId = req.params.replyId;

    Activity.findById(activityId, function (err, activity) {
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

        var isActivityCreator = user.username === activity.creator;

        var comment = activity.discussion.filter(function (comm) {
            return comm._id == commentId;
        }).pop();

        if (!comment) {
            return res.status(404).json({
                data: null,
                err: 'Comment doesn\'t exist',
                msg: null
            });
        }

        var isCommentCreator = comment.creator === user.username;

        var reply = comment.replies.filter(function (rep) {
            return rep._id == replyId;
        });

        if (!reply) {
            return res.status(404).json({
                data: null,
                err: 'reply doesn\'t exist',
                msg: null
            });
        }

        var isReplyCreator = reply.creator === user.username;

        if (
            !user.isAdmin &&
            !isActivityCreator &&
            !isCommentCreator &&
            !isReplyCreator
        ) {
            return res.status(403).json({
                data: null,
                err: 'You can\'t delete this comment',
                msg: null
            });
        }

        comment.replies.id(replyId).remove();

        activity.save(function (err2) {
            if (err2) {
                return next(500);
            }

            return res.status(204).json({
                data: null,
                err: null,
                msg: 'comment deleted successfully'
            });
        });
    });
};
