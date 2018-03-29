var mongoose = require('mongoose');
var Content = mongoose.model('Content');
var ObjectIdValidator = require('../utils/validators/is-object-id');

module.exports.getNumberOfContentPages = function (req, res, next) {

    if (req.params.category && req.params.section) {
        Content.find({
            category: req.params.category,
            section: req.params.section
        }).count().
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
    } else if (req.params.category) {
        Content.find({ category: req.params.category }).count().
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
    } else {
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
    }
};

module.exports.getContentPage = function (req, res, next) {
    var pageNumber = req.params.pageNumber;
    var numberOfEntriesPerPage = req.params.numberOfEntriesPerPage;
    if (req.params.category && req.params.section) {
        Content.find({
            category: req.params.category,
            section: req.params.section
        }).skip((pageNumber - 1) * numberOfEntriesPerPage).
            limit(numberOfEntriesPerPage).
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
    } else if (req.params.category) {
        Content.find({ category: req.params.category }).
            skip((pageNumber - 1) * numberOfEntriesPerPage).
            limit(numberOfEntriesPerPage).
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
    } else {
        Content.find().skip((pageNumber - 1) * numberOfEntriesPerPage).
            limit(numberOfEntriesPerPage).
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
    }
};

module.exports.getContentById = function(req, res, next) {
    var id = req.params.id;

    if (!ObjectIdValidator.isObjectId(id)) {
        return res.status(422).json({
            data: null,
            err: 'The Content Id is not valid.',
            msg: null
        });
    }
    //TODO add the rest of the logic

};
