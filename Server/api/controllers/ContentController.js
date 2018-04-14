/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */


var mongoose = require('mongoose');
var Content = mongoose.model('Content');
var Category = mongoose.model('Category');
var ContentRequest = mongoose.model('ContentRequest');
var User = mongoose.model('User');
var moment = require('moment');

// retrieve content (resource  or idea) by ObejctId
module.exports.getContentById = function (req, res, next) {

    // id was invalid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(422).json({
            data: null,
            err: 'The Content Id is not valid.',
            msg: null
        });
    }

    // find and send the content
    Content.findById(req.params.id).exec(function (err, content) {
        if (err) {
            return next(err);
        }

        // content id did not match anything
        if (!content) {
            return res.status(404).json({
                data: null,
                err: 'The requested content was not found.',
                msg: null
            });
        }

        // content was found successfully

        return res.status(200).json({
            data: content,
            err: null,
            msg: 'Content was retrieved successfully'
        });

    });

};

// helper for getSearchPage
var prepareQueryConditionsForSearch = function (query) {
    // default search conditions
    var conditions = {
        '$text': { '$search': query.searchQuery },
        'approved': true,
        'category': query.category,
        'section': query.section
    };

    // section and category are not of interest
    if (query.category === '' || query.section === '') {
        delete conditions.category;
        delete conditions.section;
    }

    // title and tags not of interest
    if (query.searchQuery === '') {
        delete conditions.$text;
    }

    return conditions;
};

// helper for getSearchPage
var prepareQueryOptionsForSearch = function (query, params) {
    // default search options
    var options = {
        limit: Number(params.pageSize),
        page: Number(params.pageNumber),
        sort: {}
    };

    // sort option was provided, default is relevance;
    // therefore, the string relevance is not checked
    if (query.sort) {

        if (query.sort === 'upload date') {
            options.sort.touchDate = -1;
        }

        if (query.sort === 'rating') {
            options.sort.rating = -1;
        }
    }

    // relevance is of importance to the query
    if (query.searchQuery !== '') {
        options.select = { score: { $meta: 'textScore' } };
        options.sort.score = { $meta: 'textScore' };
    }

    return options;
};

// helper for getSearchPage
var checkRequestValidityForSearch = function (req) {

    return req.params.pageSize &&
        req.params.pageNumber &&
        req.query &&
        typeof req.query.category === 'string' &&
        typeof req.query.section === 'string' &&
        typeof req.query.searchQuery === 'string' &&
        typeof req.query.sort === 'string' &&
        !isNaN(req.params.pageSize) &&
        !isNaN(req.params.pageNumber);
};

module.exports.getSearchPage = function (req, res, next) {
    // check for validtity
    var valid = checkRequestValidityForSearch(req);

    // the request was not valid
    if (!valid) {
        return res.status(422).json({
            data: null,
            err: 'The required fields were missing or of wrong type.',
            msg: null
        });
    }

    // prepare the conditions and options for the query
    var conditions = prepareQueryConditionsForSearch(req.query);
    var options = prepareQueryOptionsForSearch(req.query, req.params);

    // log the options and conditions for debugging
    console.log(options);
    console.log(conditions);

    // execute the database query
    Content.paginate(
        conditions,
        options,
        function (err, contents) {
            if (err) {
                return next(err);
            }

            // send the page of contents

            return res.status(200).json({
                data: contents,
                err: null,
                msg: 'The contents searched for by ' +
                    'the user were retrieved successfully'
            });
        }
    );
};

// retrieve the content (resources and ideas) created by the specified user
//must be authenticated
module.exports.getContentByCreator = function (req, res, next) {

    // validations
    var valid = req.params.pageSize &&
        req.params.pageNumber &&
        req.query &&
        typeof req.query.category === 'string' &&
        typeof req.query.section === 'string' &&
        !isNaN(req.params.pageNumber) &&
        !isNaN(req.params.pageSize);

    // request was not valid
    if (!valid) {
        return res.status(422).json({
            data: null,
            err: 'The required fields were missing or of wrong type.',
            msg: null
        });
    }

    // database query conditions
    var conditions = {
        category: req.query.category,
        creator: req.user.username,
        section: req.query.section
    };

    // category and section are not of interest
    if (req.query.section === '' || req.query.category === '') {
        delete conditions.category;
        delete conditions.section;
    }

    // send back a page of the content created by the current user
    Content.paginate(
        conditions,
        {
            limit: Number(req.params.pageSize),
            page: Number(req.params.pageNumber)
        },
        function (err, contents) {
            if (err) {
                return next(err);
            }

            // send the page of contents

            return res.status(200).json({
                data: contents,
                err: null,
                msg: 'The contents created by' +
                    'the user were retrieved successfully'
            });
        }
    );
};

module.exports.validateSelectedCategory = function (req, res, next) {
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
        next();
    });
};

module.exports.validateContent = function (req, res, next) {
    var valid = req.body.title &&
        req.body.body &&
        req.body.category &&
        req.body.section &&
        req.body.creator &&
        typeof req.body.title === 'string' &&
        typeof req.body.body === 'string' &&
        typeof req.body.category === 'string' &&
        typeof req.body.section === 'string' &&
        typeof req.body.creator === 'string';

    if (!valid) {
        return res.status(422).json({
            data: null,
            err: 'content metadata is not supplied',
            msg: null
        });
    }
    next();
};


var handleAdminCreate = function (req, res, next) {
    req.body.approved = true;
    Content.create(req.body, function (contentError, content) {
        if (contentError) {
            return next(contentError);
        }

        User.findOneAndUpdate(
            { 'username': req.user.username },
            { $set: { contributionScore: req.user.contributionScore + 10 } },
            { new: true },
            function (err, user) {
                if (err) {
                    console.log('cannot add contributionPoints to' +
                        req.user.username);
                }
                // if not found return error
                if (!user) {
                    return res.status(404).json({
                        data: null,
                        err: 'User not found',
                        msg: null
                    });
                }
            }
        );

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
            creator: req.user.username,
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


module.exports.createContent = function (req, res, next) {
    var valid = req.body.title &&
        req.body.body &&
        req.body.category &&
        req.body.section &&
        req.body.creator &&
        typeof req.body.title === 'string' &&
        typeof req.body.body === 'string' &&
        typeof req.body.category === 'string' &&
        typeof req.body.section === 'string' &&
        typeof req.body.creator === 'string';

    if (!valid) {
        return res.status(422).json({
            data: null,
            err: 'content metadata is not supplied',
            msg: null
        });
    }
    delete req.body.touchDate;
    delete req.body.approved;
    delete req.body.creator;
    req.body.creator = req.user.username;
    // admin user content creation handler
    if (req.user.isAdmin) {
        return handleAdminCreate(req, res, next);
    }

    // non admin user content creation handler
    return handleNonAdminCreate(req, res, next);
};

var handleAdminUpdate = function (req, res, next) {
    req.body.approved = true;
    var id = req.body._id;
    delete req.body._id;
    Content.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true },
        function (err, updatedContent) {
            if (err) {
                return next(err);
            }

            return res.status(200).json({
                data: updatedContent,
                err: null,
                mesg: 'retrieved the content successfully'
            });
        }
    );
};

var handleNonAdminUpdate = function (req, res, next) {
    req.body.approved = false;
    ContentRequest.create({
        contentID: req.body._id,
        contentTitle: req.body.title,
        contentType: req.body.type,
        creator: req.user.username,
        requestType: 'update'
    }, function (requestError, contentRequest) {
        if (requestError) {
            return next(requestError);
        }
        Content.findByIdAndUpdate(
            req.body._id,
            { $set: req.body },
            { new: true },
            function (contentError, updatedContent) {
                if (contentError) {
                    return next(contentError);
                }

                return res.status(200).json({
                    data: {
                        content: updatedContent,
                        request: contentRequest
                    },
                    err: null,
                    msg: 'updated content successfully'
                });
            }
        );
    });
};
module.exports.updateContent = function (req, res, next) {
    delete req.body.approved;
    delete req.body.v;
    req.body.touchDate = moment().toDate();
    req.body.creator = req.user.username;
    if (req.user.isAdmin) {
        return handleAdminUpdate(req, res, next);
    }

    return handleNonAdminUpdate(req, res, next);
};

// retrieve the categories
// by which the contents (ideas and resources) are classified
module.exports.getCategories = function (req, res, next) {

    // find all the categories
    Category.find({}).exec(function (err, categories) {
        if (err) {
            return next(err);
        }

        // send response with retrieved categories

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
    if (typeof req.body.category === 'string') {
        return res.status(422).json({
            data: null,
            err: 'category type is invalid',
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(422).json({
            data: null,
            err: 'The category id supplied is invalid',
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

    if (typeof req.body.section === 'string') {
        return res.status(422).json({
            data: null,
            err: 'The section value is invalid',
            msg: null
        });
    }

    Category.findByIdAndUpdate(
        req.params.id,
        { $push: { sections: { name: req.body.section } } },
        { new: true },
        function (updateError, updatedCategory) {
            if (updateError) {

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

            return res.status(200).json({
                data: contents,
                err: null,
                msg: 'Contents retrieved successfully.'
            });
        });
};
