var mongoose = require('mongoose'),
    auth = require('basic-auth'),
    Validators = require('../utils/validators'),
    Activity = mongoose.model('Activity');



module.exports.getActivities = function (req, res, next) {
    /*
        Middleware for retrieving activities

        Admin can retrieve all activities while other users 
        can only retrieve verified activities

        @author: Wessam
    */

    // TODO: getting user info from headers
    var page = req.body.page;
    var valid = page && Validators.isInteger(page);
    if (!valid) {
        page = 1;
    }
    Activity.paginate({}, { page: page, limit: 10}, function(err, activities){
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