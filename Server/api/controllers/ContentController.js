var mongoose = require('mongoose');
var Content = mongoose.model('Content');

module.exports.getNumberOfContentPages = function (req, res, next) {
    Content.find().exec(function (err, count) {
        if (err) {
            return next(err);
        }

        return res.status(200).json({
            data: count,
            err: null,
            msg: 'productId parameter must be a valid ObjectId.'
        });

    });
}

module.exports.getContentPage = function (req, res, next) {

}