var mongoose = require('mongoose');
var Tag = mongoose.model('Tag');

// addTag starts
module.exports.addTag = function (req, res, next) {
    //Validity check
    if (!(typeof req.body.name === 'string')) {
        console.log('please insert tag"s name as a string');
    }

    if (req.body.name) {
        return res.status(422).json({
            data: null,
            err: null,
            msg: 'name(String) is a required field.'
        });
    }

    // If the user is an admin then create Tag
    if (req.user.isAdmin) {
        Tag.create(req.body, function (err, tag) {
            if (err) {
                return next(err);
            }

            return res.status(201).json({
                data: tag,
                err: null,
                msg: 'Tag Created'
            });
        });
    } else {
        //If user is not an Admin
        res.status(403).json({
            data: null,
            err: 'You are not an admin to do that',
            msg: null
        });
    }
};
//addTag ends

//addSubtag starts
module.exports.addSubtag = function (req, res, next) {

    Tag.findOne({ _id: req.params.id }, function (err) {
        if (err) {
            return res.status(404).json({
                data: null,
                err: null,
                msg: 'Request not found.'
            });
        }

        //Validity check
        if (!(typeof req.body.subtag === 'string')) {
            console.log('please insert subtag"s name as a string');
        }
        var valid = req.body.subtag;

        if (!valid) {
            return res.status(422).json({
                data: null,
                err: null,
                msg: 'subtag[String] is a required field.'
            });
        }

        // If the user is an admin then create Tag
        if (req.user.isAdmin) {
            Tag.updateOne(
                { _id: req.params.id },
                { $push: { subtags: req.body.subtag } },
                function (error, subtag) {
                    if (error) {
                        return next(error);
                    }

                    return res.status(201).json({
                        data: subtag,
                        err: null,
                        msg: 'Subtag Added'
                    });
                }
            );
        } else {
            //If user is not an Admin
            res.status(403).json({
                data: null,
                err: 'You are not an admin to do that',
                msg: null
            });
        }
    });
};
//addSubtag ends

//getTag starts
module.exports.getTags = function (req, res, next) {
    Tag.find({}).exec(function (err, tags) {
        if (err) {
            return next(err);
        }

        return res.status(200).json({
            data: tags,
            err: null,
            msg: 'Tags retrieved successfully.'
        });
    });
};

module.exports.getSubtags = function (req, res, next) {
    Tag.findOne({ _id: req.params.id }).exec(function (err, tag) {
        if (err) {
            return next(err);
        }

        return res.status(200).json({
            data: tag.subtag,
            err: null,
            msg: 'Tags retrieved successfully.'
        });
    });
};

//deleteTag starts
module.exports.deleteTag = function (req, res, next) {
    // Check on whether the user is an admin
    if (req.user.isAdmin) {
        Tag.findOne({ _id: req.params.id }).exec(function (err, tag) {
            if (err) {
                return next(err);
            }
            if (tag) {
                Tag.remove({ _id: req.params.id }, function (err1, msg) {
                    if (err1) {
                        return next(err1);
                    }

                    return res.status(200).json({
                        data: msg,
                        err: null,
                        msg: 'Tag deleted successfully.'
                    });
                });
            } else {
                return res.status(404).json({
                    data: null,
                    err: null,
                    msg: 'Tag not found.'
                });
            }
        });
    } else {
        res.status(403).json({
            data: null,
            err: 'You are not an admin to do that',
            msg: null
        });
    }
};
//deleteTag ends

module.exports.deleteSubtag = function (req, res, next) {
    if (req.user.isAdmin) {
        // Find the tag
        Tag.updateOne(
            { _id: req.params.id },
            { $pull: { subtags: req.body.subtag } },
            function (err) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: null,
                    err: null,
                    msg: 'Subtag deleted successfully.'
                });
            }
        );

    } else {
        res.status(403).json({
            data: null,
            err: 'You are not an admin to do that',
            msg: null
        });
    }
};
