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
