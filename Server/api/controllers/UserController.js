var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.signUp = function (req, res, next) {
    User.create(req.body, function (err, user) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            data: user,
            err: null,
            msg: 'Success!'
        });
    });
};

module.exports.signIn = function (req, res, next) {
    User.findOne(req.username, function (err, user) {
        if (err) {
            return next(err);
        } else if (!user.validPassword(req.password)) {
            res.status(422).json({
                data: user,
                err: null,
                msg: 'Failed!'
            });
        }

        return res.status(200).json({
            data: user,
            err: null,
            msg: 'User retrieved successfully.'
        });
    });
};
