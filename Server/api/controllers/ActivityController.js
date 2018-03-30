var mongoose = require('mongoose'),
    auth = require('basic-auth'),
    Activity = mongoose.model('Activity');



module.exports.getActivities = function (req, res, next) {
    /*
        Middleware for retrieving activities

        Admin can retrieve all activities while other users 
        can only retrieve verified activities

        @author: Wessam
    */

    // TODO: getting user info from headers
    var pageN = Number(req.query.page);
    var valid = pageN && (!isNaN(pageN));
    if (!valid) {
        pageN = 1;
    }
    Activity.paginate({}, { page: pageN, limit: 10}, function(err, activities){
        if(err){
            return next(err);
        }
        res.status(200).json({
            err: null,
            msg: "Activities retrieved successfully",
            data: activities
        });
    });
}