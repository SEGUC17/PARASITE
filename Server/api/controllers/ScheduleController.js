var mongoose = require('mongoose');
var CalendarEvent = mongoose.model('CalendarEvent');
var User = mongoose.model('User');

module.exports.getPersonalSchedule = function (req, res, next) {
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err)
            return next(err);

        return res.status(200).json({
            data: user.schedule,
            err: null,
            msg: 'Schedule retrieved successfully.'
        });
    });
};

    module.exports.updateSchedule = function (req, res, next) {
        User.findOneAndUpdate(
            { username: req.params.username },
             { $set: { 'schedule': req.body } },
         function (err, user) {
            if (err) {
                return next(err);
            }
            res.status(200).json({
                data: user,
                err: null,
                msg: 'Schedule updated succesfully.'
            });
        }
    );
    };
