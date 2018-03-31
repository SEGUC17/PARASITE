var mongoose = require('mongoose');
var CalendarEvent = mongoose.model('CalendarEvent');
var User = mongoose.model('User');

    module.exports.updateSchedule = function (req, res, next) {
        User.findOneAndUpdate(
            { username: req.params.username },
             { $push: { 'schedule': req.body } },
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
