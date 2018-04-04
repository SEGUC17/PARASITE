var mongoose = require('mongoose');
var CalendarEvent = mongoose.model('CalendarEvent'),
    User = mongoose.model('User');

module.exports.getPersonalSchedule = function (req, res, next) {
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(404).json({
                data: null,
                err: 'User not found.',
                msg: null
            });
        }

        return res.status(200).json({
            data: user.schedule,
            err: null,
            msg: 'Schedule retrieved successfully.'
        });
    });
};

module.exports.updateSchedule = function (req, res, next) {
    console.log('Entered Service');
    User.findOneAndUpdate(
        { username: req.params.username },
         { $set: { 'schedule': req.body } },
     function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
        return res.status(404).json({
            data: null,
            err: 'User not found.',
            msg: null
        });
    }

        return res.status(200).json({
            data: user.schedule,
            err: null,
            msg: 'Schedule updated succesfully.'
        });
    }
);
};
