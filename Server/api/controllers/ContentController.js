/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */


var mongoose = require('mongoose');
var Content = mongoose.model('Content');
var Category = mongoose.model('Category');
var ContentRequest = mongoose.model('ContentRequest');

module.exports.getNumberOfContentPages = function (req, res, next) {
    if (req.params.category !== 'NoCat' &&
        req.params.section !== 'NoSec') {
        Content.find({
            category: req.params.category,
            section: req.params.section
        }).count().
            exec(function (err, count) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: count,
                    err: null,
                    msg: 'Number of pages was retrieved'
                });
            });
    } else if (req.params.category === 'NoCat') {
        Content.find().count().
            exec(function (err, count) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: count,
                    err: null,
                    msg: 'Number of pages was retrieved'
                });
            });
    } else {
        Content.find({ category: req.params.category }).count().
            exec(function (err, count) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: count,
                    err: null,
                    msg: 'Number of pages was retrieved'
                });
            });
    }
};

module.exports.getContentPage = function (req, res, next) {
    if (req.params.category !== 'NoCat' && req.params.section !== 'NoSec') {
        Content.paginate(
            {
                category: req.params.category,
                section: req.params.section
            },
            {
                limit: Number(req.params.numberOfEntriesPerPage),
                page: Number(req.params.pageNumber)
            },
            function (err, contents) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: contents,
                    err: null,
                    msg: 'Page retrieved successfully'
                });
            }
        );
    } else if (req.params.category === 'NoCat') {
        Content.paginate(
            {},
            {
                limit: Number(req.params.numberOfEntriesPerPage),
                page: Number(req.params.pageNumber)
            },
            function (err, contents) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: contents,
                    err: null,
                    msg: 'Page retrieved successfully'
                });
            }
        );
    } else {
        Content.paginate(
            { creator: req.params.category },
            {
                limit: Number(req.params.numberOfEntriesPerPage),
                page: Number(req.params.pageNumber)
            },
            function (err, contents) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: contents,
                    err: null,
                    msg: 'Page retrieved successfully'
                });
            }
        );
    }
};


module.exports.getContentById = function (req, res, next) {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(422).json({
            data: null,
            err: 'The Content Id is not valid.',
            msg: null
        });
    }

    Content.findById(req.params.id).exec(function (err, content) {
        if (err) {
            return next(err);
        }

        if (!content) {
            return res.status(404).json({
                data: null,
                err: 'The requested content was not found.',
                msg: null
            });
        }

        return res.status(200).json({
            data: content,
            err: null,
            msg: 'Content was retrieved successfully'
        });

    });

};

module.exports.getContentByCreator = function (req, res, next) {
    console.log(req.params.creator);
    if (!req.params.creator) {
        return res.status(422).json({
            data: null,
            err: 'The Creator username is not valid.',
            msg: null
        });
    }

    Content.paginate(
        { creator: req.params.creator },
        {
            limit: Number(req.params.pageSize),
            page: Number(req.params.pageNumber)
        },
        function (err, contents) {
            if (err) {
                return next(err);
            }

            return res.status(200).json({
                data: contents,
                err: null,
                msg: 'The contents created by' +
                    'the user were retrieved successfully'
            });
        }
    );
};

module.exports.getNumberOfContentByCreator = function (req, res, next) {
    if (!req.params.creator) {
        return res.status(422).json({
            data: null,
            err: 'The Creator username is not valid.',
            msg: null
        });
    }

    Content.
        find({ creator: req.params.creator }).count().
        exec(function (err, count) {
            if (err) {
                return next(err);
            }

            return res.status(200).json({
                data: count,
                err: null,
                msg: 'Number of content by creator retrieved successfully'
            });
        });
};

var handleAdminCreate = function (req, res, next) {
    req.body.approved = true;
    Content.create(req.body, function (contentError, content) {
        if (contentError) {
            return next(contentError);
        }

        return res.status(201).json({
            data: content,
            err: null,
            msg: 'Content was created successfully'
        });
    });
};

var handleNonAdminCreate = function (req, res, next) {
    req.body.approved = false;
    Content.create(req.body, function (contentError, content) {
        if (contentError) {
            return next(contentError);
        }
        ContentRequest.create({
            contentID: content._id,
            contentTitle: content.title,
            contentType: content.type,
            creator: req.user._id,
            requestType: 'create'
        }, function (requestError, contentRequest) {
            if (requestError) {
                return next(requestError);
            }

            return res.status(201).json({
                data: [
                    content,
                    contentRequest
                ],
                err: null,
                msg: 'Created content and made a request successfully'
            });
        });
    });
};


/*eslint max-statements: ["error", 50]*/

module.exports.createContent = function (req, res, next) {
    var valid = req.body.title &&
        req.body.body &&
        req.body.category &&
        req.body.section &&
        req.body.creator;
    if (!valid) {
        return res.status(422).json({
            data: null,
            err: 'content metadata is not supplied',
            msg: null
        });
    }
    Category.findOne({ name: req.body.category }, function (err, category) {
        if (err) {
            return next(err);
        }

        if (!category) {
            return res.status(422).json({
                data: null,
                err: 'the category supplied is invalid',
                msg: null
            });
        }
        var sectionNames = category.sections.map(function (section) {
            return section.name;
        });
        if (!sectionNames.includes(req.body.section)) {
            return res.status(422).json({
                data: null,
                err: 'the section supplied is invalid',
                msg: null
            });
        }
        delete req.body.touchDate;
        delete req.body.approved;
        // admin handler for now open for anyone
        // TODO fix permissions on auth ready
        if (!req.user) {
            return handleAdminCreate(req, res, next);
        }

        // non admin handler, toggle condition to activate
        handleNonAdminCreate(req, res, next);
    });

};

module.exports.getCategories = function (req, res, next) {
    Category.find({}).exec(function (err, categories) {
        if (err) {
            return next(err);
        }

        return res.status(200).json({
            data: categories,
            err: null,
            msg: 'retrieved catogies successfully'
        });
    });

};

module.exports.createCategory = function (req, res, next) {
    if (!req.body.category) {
        return res.status(422).json({
            data: null,
            err: 'No category supplied',
            msg: null
        });

    }

    if (!req.body.category) {
        return res.status(422).json({
            data: null,
            err: 'Wrong Category type error',
            msg: null
        });
    }

    Category.create(
        { name: req.body.category.trim().toLowerCase() },
        function (err, category) {
            if (err) {
                return next(err);
            }

            return res.status(201).json({
                data: category,
                err: null,
                msg: 'Category was created successfully'
            });
        }
    );

};

module.exports.createSection = function (req, res, next) {
    if (!req.params.id) {
        return res.status(422).json({
            data: null,
            err: 'The category is not supplied',
            msg: null
        });
    }

    if (!req.body.section) {
        return res.status(422).json({
            data: null,
            err: 'The section is not supplied',
            msg: null
        });
    }
    Category.findByIdAndUpdate(
        req.params.id,
        { $push: { sections: { name: req.body.section } } },
        { new: true },
        function (updateError, updatedCategory) {
            if (updateError) {
                console.log(updateError);

                return next(updateError);
            }

            return res.status(200).json({
                data: updatedCategory,
                err: null,
                msg: 'Updated the category with the section ' +
                    req.body.section + ' successfully!'
            });
        }
    );

};
