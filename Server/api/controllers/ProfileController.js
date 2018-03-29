var mongoose = require('mongoose'),
User = mongoose.model('User');



module.exports.requestUserValidation = function(req, res, next) {
//TODO: make a request
//Author: Maher
res.writeHead(200, { 'Content-Type': 'text/plain' });
res.end('FROM SERVER: making request');
};


module.exports.getChildren = function (req, res, next) {
   
    User.findById(req.params.userId).exec(function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res
                .status(404)
                .json({ err: null, msg: 'User not found.', data: null });
        }

        res.status(200).json({
            err: null,
            msg: 'Children retrieved successfully.',
            data: user.children
        });
    });
};
