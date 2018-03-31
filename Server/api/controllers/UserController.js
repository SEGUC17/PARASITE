var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.signUp = function (err, res, newUser, message, next) {
    if (err) {
        return next(err);
    } else if (newUser) {
        return res.status(201).json({
            data: newUser,
            err: null,
            msg: 'Sign Up Is Success'
        });
    }

    return res.status(400).json({
        data: null,
        err: null,
        msg: message.signUpMessage
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
