/* eslint max-statements: ["error", 12] */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */


var mongoose = require('mongoose');
var Content = mongoose.model('Content');
var Category = mongoose.model('Category');
var ContentRequest = mongoose.model('ContentRequest');
var User = mongoose.model('User');
var moment = require('moment');
var Tag = mongoose.model('Tag');

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
        'language': query.language,
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
        select:
            {
                body: 0,
                discussion: 0
            },
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
        options.select.score = { $meta: 'textScore' };
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
        typeof req.query.language === 'string' &&
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

    // execute the database query
    Content.paginate(
        conditions,
        options,
        function (err, contents) {
            if (err) {
                return next(err);
            }

            // get a list of all the creators
            var creators = [];
            var counter = 0;
            for (counter; counter < contents.docs.length; counter += 1) {
                if (!creators.includes(contents.docs[counter].creator)) {
                    creators.push(contents.docs[counter].creator);
                }
            }

            // find the creator's avatar links
            User.find(
                { username: { $in: creators } },
                {
                    _id: 0,
                    avatar: 1,
                    username: 1
                },
                function (error, userAvatars) {
                    if (error) {
                        return next(err);
                    }

                    // send the page of contents

                    return res.status(200).json({
                        data: {
                            contents: contents,
                            userAvatars: userAvatars
                        },
                        err: null,
                        msg: 'The contents searched for by ' +
                            'the user were retrieved successfully'
                    });
                }
            );
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
            page: Number(req.params.pageNumber),
            select: { discussion: 0 }
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
        res.locals.category = category;
        next();
    });
};

module.exports.validateSelectedSection = function (req, res, next) {
    var category = res.locals.category;
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
};

module.exports.validateContent = function (req, res, next) {
    var valid = req.body.title &&
        req.body.body &&
        req.body.category &&
        req.body.section &&
        typeof req.body.title === 'string' &&
        typeof req.body.body === 'string' &&
        typeof req.body.category === 'string' &&
        typeof req.body.section === 'string';
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

//Delete Content
module.exports.deleteContent = function (req, res, next) {
    var valid = false;
    var isOwner = false;
    var isAdmin = false;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(422).json({
            data: null,
            err: 'The Content Id is not valid.',
            msg: null
        });
    }

    Content.findById(req.params.id, function (
        err,
        content
    ) {
        if (err) {
            return next(err);
        }
        if (content.creator === req.user.username) {
            isOwner = true;

        }
        if (req.user.isAdmin) {
            isAdmin = true;
        }
        valid = isOwner || isAdmin;
        if (!valid) {
            return res.status(422).json({
                data: null,
                err: 'The Content Id is not valid.',
                msg: null
            });
        }
        Content.remove({ _id: req.params.id }).
            exec(function (removeError) {
                if (removeError) {
                    return next(removeError);
                }
                res.status(200).json({
                    data: null,
                    err: null,
                    msg: 'Content was deleted successfully'
                });
            });
    });
};

var handleAdminUpdate = function (req, res, next) {
    // No requests are made, and content is approved automatically
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
    // create a content request, and set approval status to false
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

module.exports.checkAdmin = function (req, res, next) {
    // Admin permission check

    if (!req.user.isAdmin) {
        return res.status(403).json({
            data: null,
            err: 'The user has to be an admin',
            msg: null
        });
    }
    next();
};

module.exports.validateIconLink = function (req, res, next) {
    // category icon link validation
    if (!req.body.iconLink) {
        return res.status(422).json({
            data: null,
            err: 'No icon link supplied',
            msg: null
        });
    }
    if (typeof req.body.iconLink !== 'string') {
        return res.status(422).json({
            data: null,
            err: 'icon link type is invalid',
            msg: null
        });
    }
    next();
};


module.exports.createCategory = function (req, res, next) {

    // category name validation check
    if (!req.body.category) {
        return res.status(422).json({
            data: null,
            err: 'No category supplied',
            msg: null
        });
    }
    if (typeof req.body.category !== 'string') {
        return res.status(422).json({
            data: null,
            err: 'category type is invalid',
            msg: null
        });
    }

    Category.create(
        {
            iconLink: req.body.iconLink,
            name: req.body.category.toLowerCase()
        },
        function (err, category) {
            if (err) {
                return next(err);
            }
            Tag.create(
                { name: req.body.category.toLowerCase() },
                function (err1) {
                    if (err1) {
                        return next(err1);
                    }
                }
            );

            return res.status(201).json({
                data: category,
                err: null,
                msg: 'Category was created successfully'
            });
        }
    );

};

module.exports.createSection = function (req, res, next) {

    if (!req.params.id || req.params.id === 'null') {
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

    if (typeof req.body.section !== 'string') {
        return res.status(422).json({
            data: null,
            err: 'The section value is invalid',
            msg: null
        });
    }

    Category.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                sections: {
                    iconLink: req.body.iconLink,
                    name: req.body.section
                }
            }
        },
        { new: true },
        function (updateError, updatedCategory) {
            if (updateError) {

                return next(updateError);
            }

            return res.status(201).json({
                data: updatedCategory,
                err: null,
                msg: 'Updated the category with the section ' +
                    req.body.section + ' successfully!'
            });
        }
    );

};


module.exports.updateCategory = function (req, res, next) {
    // validate category id
    if (!mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
        return res.status(422).json({
            data: null,
            err: 'The category id provided was not valid',
            msg: null
        });
    }
    // category name validation check
    if (!req.body.name) {
        return res.status(422).json({
            data: null,
            err: 'No category supplied',
            msg: null
        });
    }
    if (typeof req.body.name !== 'string') {
        return res.status(422).json({
            data: null,
            err: 'category type is invalid',
            msg: null
        });
    }

    //find category by ID and update it
    Category.findByIdAndUpdate(
        req.params.categoryId,
        {
            $set: {
                iconLink: req.body.iconLink,
                name: req.body.name.trim().toLowerCase()
            }
        },
        function (categoryUpdateError, oldCategory) {
            if (categoryUpdateError) {
                return next(categoryUpdateError);
            }

            Content.updateMany(
                { category: oldCategory.name },
                {
                    $set:
                        { category: req.body.name.trim().toLowerCase() }
                },
                function (contentUpdateError) {
                    if (contentUpdateError) {
                        return next(contentUpdateError);
                    }

                    return res.status(200).json({
                        data: null,
                        err: null,
                        msg: 'updated category and' +
                            'associated content successfully'
                    });
                }
            );
        }
    );
};

module.exports.updateSection = function (req, res, next) {

    // validate category id
    if (!mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
        return res.status(422).json({
            data: null,
            err: 'The category id provided was not valid',
            msg: null
        });
    }
    // validate section id
    if (!mongoose.Types.ObjectId.isValid(req.params.sectionId)) {
        return res.status(422).json({
            data: null,
            err: 'The section id provided is invalid',
            msg: null
        });
    }

    // validate section name
    if (!req.body.sectionName) {
        return res.status(422).json({
            data: null,
            err: 'The section name is not supplied',
            msg: null
        });

    }

    if (typeof req.body.sectionName !== 'string') {
        return res.status(422).json({
            data: null,
            err: 'The section name is not supplied',
            msg: null
        });

    }

    // get the target section of the update
    Category.findOne(
        { _id: req.params.categoryId },
        function (err, targetCategory) {
            if (err) {
                return next(err);
            }
            var targetSection = targetCategory.
                sections.id(req.params.sectionId);

            // update target section
            Category.findOneAndUpdate(
                {
                    _id: req.params.categoryId,
                    'sections._id': req.params.sectionId
                },
                {
                    $set: {
                        'sections.$.iconLink': req.body.iconLink,
                        'sections.$.name': req.body.sectionName
                    }
                },
                { new: true },
                function (updateCategoryError, updatedCategory) {
                    if (updateCategoryError) {
                        return next(updateCategoryError);
                    }
                    // update the content under that section
                    Content.updateMany(
                        { section: targetSection.name },
                        {
                            $set:
                                { section: req.body.sectionName }
                        },
                        function (contentUpdateError) {
                            if (contentUpdateError) {
                                return next(contentUpdateError);
                            }

                            return res.status(200).json({
                                data: updatedCategory,
                                err: null,
                                msg: 'The section was updated successfully' +
                                    ' and the content in that' +
                                    ' section was updated'
                            });
                        }
                    );
                }
            );
        }
    );


};


module.exports.deleteCategory = function (req, res, next) {

    // validate category id
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(422).json({
            data: null,
            err: 'The category id provided was not valid',
            msg: null
        });
    }

    // find the category and delete it
    Category.findByIdAndRemove(
        req.params.id,
        function (err, deletedCategory) {
            if (err) {
                return next(err);
            }

            // category was not found in the database
            if (!deletedCategory) {
                return res.status(404).json({
                    data: null,
                    err: 'The category to be deleted could not be found.',
                    msg: null
                });
            }

            // category was deleted successfully; delete all associated content
            Content.deleteMany(
                { category: deletedCategory.name },
                function (error) {
                    if (error) {
                        return next(error);
                    }
                    // return response all okay

                    return res.status(200).json({
                        data: null,
                        err: null,
                        msg: 'Category and all associated content' +
                            ' were deleted successfully.'
                    });
                }
            );
        }
    );
};


module.exports.deleteSection = function (req, res, next) {

    // validate category and section id
    if (!mongoose.Types.ObjectId.isValid(req.params.categoryId) ||
        !mongoose.Types.ObjectId.isValid(req.params.sectionId)) {
        return res.status(422).json({
            data: null,
            err: 'The category or section id provided was not valid',
            msg: null
        });
    }

    // find the category and remove section
    Category.findByIdAndUpdate(
        req.params.categoryId,
        { $pull: { sections: { _id: req.params.sectionId } } },
        function (err, categoryBeforeDeletion) {
            if (err) {
                return next(err);
            }

            // determine the name of the section that was deleted
            var sections = categoryBeforeDeletion.sections;
            var deletedSection = '';
            for (var counter = 0; counter < sections.length; counter += 1) {
                if (sections[counter]._id === req.params.sectionId) {
                    deletedSection = sections[counter].name;
                }
            }

            // delete all the content associated with this section
            Content.deleteMany(
                {
                    category: categoryBeforeDeletion.name,
                    section: deletedSection
                },
                function (error) {
                    if (error) {
                        return next(error);
                    }

                    return res.status(200).json({
                        data: null,
                        err: null,
                        msg: 'Section and all associated content were ' +
                            'deleted successfully'
                    });
                }
            );
        }
    );
};

module.exports.addScore = function (req, res, next) {
    User.findByIdAndUpdate(
        req.user._id,
        { learningScore: req.user.learningScore + 10 },
        { new: true },
        function (err, user) {
            if (err) {
                return next(err);
            }

            return res.status(200).json({
                data: null,
                err: null,
                msg: 'You got 10 more learning points,' +
                    ' your score is now ' + user.learningScore
            });
        }
    );
};

module.exports.prepareContent = function (req, res, next) {

    /*
     *  function to prepare content for discussion
     *
     * @author: Wessam
     */

    var contentId = req.params.contentId;

    Content.findById(contentId).
        exec(function (err, content) {
            if (err) {
                return next(err);
            }
            if (!content) {
                return res.status(404).json({
                    data: null,
                    err: 'Content doesn\'t exist',
                    msg: null
                });
            }
            req.object = content;
            req.verified = content.approved;

            return next();
        });
};
