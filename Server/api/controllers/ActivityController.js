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
    
    if(user_id){
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
    var filter = {};
    if(!isAdmin){
        filter.status = 'verified';
    }
    Activity.paginate(filter, { page: pageN, limit: 10}, function(err, activities){
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