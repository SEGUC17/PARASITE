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
