/* eslint no-extra-parens: ["error",
 "all", { "nestedBinaryExpressions": false }] */
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
    var indexChild = req.user.children.indexOf(req.params.username);
    if (indexChild >= 0 ||
        (req.params.username === req.user.username && !req.user.isChild)) {
        var valid = Array.isArray(req.body);
        for (var index = 0; index < req.body.length && valid; index += 1) {
            valid = valid && req.body[index].title &&
                req.body[index].start;
        }
        
        if (!valid) {
            return res.status(422).json({
                data: null,
                err: 'Invalid Schedule',
                msg: null
            });
        }
        User.findOneAndUpdate(
            { username: req.params.username },
            { $set: { 'schedule': req.body } }, { new: true },
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
                    data: null,
                    err: null,
                    msg: 'Schedule updated succesfully.'
                });
            }
        );
    } else {
        return res.status(401).json({
            data: null,
            err: 'Not authorized to edit user\'s Schedule',
            msg: null
        });
    }
};

module.exports.addEvent = function (req, res, next) {
    var indexChild = req.user.children.indexOf(req.params.username);
    if (indexChild >= 0 ||
        (req.params.username === req.user.username && !req.user.isChild)) {
        var valid = req.body.start && req.body.end && req.body.title;
        if (!valid) {
            return res.status(422).json({
                data: null,
                err: 'Invalid Event',
                msg: null
            });
        }
        User.findOneAndUpdate(
            { username: req.params.username },
            { $push: { 'schedule': req.body } }, { new: true },
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
                    data: null,
                    err: null,
                    msg: 'Schedule updated succesfully.'
                });
            }
        );
    } else {
        return res.status(401).json({
            data: null,
            err: 'Not authorized to edit user\'s Schedule',
            msg: null
        });
    }
};
