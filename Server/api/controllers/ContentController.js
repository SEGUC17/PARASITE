/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */


var mongoose = require('mongoose');
var Content = mongoose.model('Content');
var Category = mongoose.model('Category');
var ContentRequest = mongoose.model('ContentRequest');

module.exports.getContentPage = function (req, res, next) {
    var valid = req.params.category && req.params.section &&
        req.params.numberOfEntriesPerPage && req.params.pageNumber &&
        typeof req.params.category === 'string' &&
        typeof req.params.section === 'string' &&
        !isNaN(req.params.numberOfEntriesPerPage) &&
        !isNaN(req.params.pageNumber);

    if (!valid) {
        return res.status(422).json({
            data: null,
            err: 'The required fields were missing or of wrong type.',
            msg: null
        });
    }

    if (req.params.category !== 'NoCat' && req.params.section !== 'NoSec') {
        Content.paginate(
            {
                approved: true,
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
            { approved: true },
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
            {
                approved: true,
                creator: req.params.category
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
    }
};


module.exports.getContentById = function (req, res, next) {

    if (!req.params.id) {
        return res.status(422).json({
            data: null,
            err: 'The required id was missing.',
            msg: null
        });
    }

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

// must be authenticated
module.exports.getContentByCreator = function (req, res, next) {
    console.log('Username: ' + req.user);

    var valid = req.params.pageSize &&
        req.params.pageNumber &&
        !isNaN(req.params.pageNumber) &&
        !isNaN(req.params.pageSize);

    if (!valid) {
        return res.status(422).json({
            data: null,
            err: 'The required fields were missing or of wrong type.',
            msg: null
        });
    }

    Content.paginate(
        { creator: req.user.username },
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
                data: {
                    content: content,
                    request: contentRequest
                },
                err: null,
                msg: 'Created content and made a request successfully'
            });
        });
    });
};


/*eslint max-statements: ["error", 12]*/
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
        if (req.user.isAdmin) {
            return handleAdminCreate(req, res, next);
        }

        // non admin handler, toggle condition to activate
        return handleNonAdminCreate(req, res, next);
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
    // Admin permission check
    if (!req.user.isAdmin) {
        return res.status(403).json({
            data: null,
            err: 'The user has to be an admin',
            msg: null
        });
    }

    // category name validation check
    if (!req.body.category) {
        return res.status(422).json({
            data: null,
            err: 'No category supplied',
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
module.exports.getContent = function (req, res, next) {
    Content.find({}).
        exec(function (err, contents) {
            if (err) {
                return next(err);
            }
            console.log(contents);

            return res.status(200).json({
                data: contents,
                err: null,
                msg: 'Contents retrieved successfully.'
            });
        });
};

