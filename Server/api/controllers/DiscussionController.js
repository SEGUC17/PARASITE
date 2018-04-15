/* eslint multiline-comment-style: ["error", "starred-block"] */
/* eslint max-statements: ["error", 20] */
/* eslint-disable eqeqeq */

module.exports.getComment = function (req, res) {

    /*
     * Middleware function for getting a comment in
     * a content or an activity
     *
     * @author: Wessam Ali
     */

    var user = req.user;
    var isVerified = req.verified;
    var isAdmin = user && user.isAdmin;
    var object = req.object;
    var isCreator = user && object.creator === user.username;
    var commentId = req.params.commentId;

    if (!isVerified && !isAdmin && !isCreator) {
        var status = user ? 403 : 401;

        return res.status(status).json({
            data: null,
            err: 'This page isn\'t verified by admin yet',
            msg: null
        });
    }
    var comment = object.discussion.filter(function (com) {
        return com._id == commentId;
    }).pop();
    if (!comment) {
        return res.status(404).json({
            data: null,
            err: 'Comment doesn\'t exist',
            msg: null
        });
    }

    return res.status(200).json({
        data: comment,
        err: null,
        msg: 'Comment retreived successfully'
    });
};

module.exports.postComment = function(req, res) {

    /*
     * Middleware function for creating a comment in
     * a content or an activity
     *
     * @author: Wessam Ali
     */

    var user = req.user;
    var isVerified = req.verified;
    var isAdmin = user && user.isAdmin;
    var object = req.object;
    var isCreator = user && object.creator === user.username;

    if (!isVerified && !isAdmin && !isCreator) {

        return res.status(404).json({
            data: null,
            err: 'This page isn\'t available',
            msg: null
        });
    }

    object.discussion.push({
        creator: user.username,
        text: req.body.text
    });

    object.save(function(err, obj) {
        if (err) {
            return res.status(422).json({
                data: null,
                err: 'Comment can\'t be empty',
                msg: null
            });
        }

        return res.status(201).json({
            data: obj.discussion.pop(),
            err: null,
            msg: null
        });
    });
};

module.exports.postCommentReply = function(req, res, next) {

    /*
     * Middleware for replying on comments
     *
     * @author: Wessam
     */

    var user = req.user;
    var isVerified = req.verified;
    var isAdmin = user && user.isAdmin;
    var object = req.object;
    var isCreator = user && object.creator === user.username;
    var commentId = req.params.commentId;

    if (!isVerified && !isAdmin && !isCreator) {

        return res.status(404).json({
            data: null,
            err: 'This page isn\'t available',
            msg: null
        });
    }

    var comment = object.discussion.filter(function (com) {
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

    object.save(function (err) {
        if (err) {
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
};

module.exports.deleteComment = function (req, res, next) {

    /*
     * Middleware for deleting comments
     *
     * @author: Wessam
     */

    var user = req.user;
    var isAdmin = user && user.isAdmin;
    var object = req.object;
    var isObjectCreator = user && object.creator === user.username;
    var commentId = req.params.commentId;

    var comment = object.discussion.filter(function (comm) {
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

    if (!isAdmin && !isObjectCreator && !isCommentCreator) {
        return res.status(403).json({
            data: null,
            err: 'You can\'t delete this comment',
            msg: null
        });
    }

    comment.remove();

    object.save(function (err) {
        if (err) {
            return next(err);
        }

        return res.status(204).json({
            data: null,
            err: null,
            msg: 'comment deleted successfully'
        });
    });
};

module.exports.deleteCommentReply = function (req, res, next) {

    /*
     * Middleware for deleting replies
     *
     * @author: Wessam
     */

    var user = req.user;
    var isAdmin = user && user.isAdmin;
    var object = req.object;
    var isObjectCreator = user && object.creator === user.username;
    var commentId = req.params.commentId;
    var replyId = req.params.replyId;

    var comment = object.discussion.filter(function (comm) {
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
        !isAdmin &&
        !isObjectCreator &&
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

    object.save(function (err) {
        if (err) {
            return next(err);
        }

        return res.status(204).json({
            data: null,
            err: null,
            msg: 'comment deleted successfully'
        });
    });
};
