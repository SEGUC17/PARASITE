var mongoose = require('mongoose');
var Content = mongoose.model('Content');

module.exports.getNumberOfContentPages = function (req, res, next) {
    Content.find().count().
    exec(function (err, count) {
        var numberOfPages =
            Math.ceil(count / req.params.numberOfEntriesPerPage);

        if (err) {
            return next(err);
        }

        return res.status(200).json({
            data: numberOfPages,
            err: null,
            msg: 'Number of pages was retrieved'
        });

    });
};

module.exports.getContentPage = function (req, res, next) {
    var pageNumber = req.params.pageNumber;
    var elementsPerPage = req.params.elementsPerPage;

    Content.find().skip((pageNumber - 1) * elementsPerPage).
        limit(elementsPerPage).
        exec(function (err, contents) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: contents,
                    err: null,
                    msg: 'Page retrieved successfully'
                });

            });
};
