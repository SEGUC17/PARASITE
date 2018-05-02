var mongoose = require('mongoose');
var Tag = mongoose.model('Tag');

// addTag starts
module.exports.addTag = function (tag) {
    //Validity check
    if (tag && typeof tag === 'string') {
        Tag.findOneAndUpdate(
            { name: tag },
            { $set: { name: tag } },
            { upsert: true },
            function (err) {
                if (err) {
                    return console.log(err);
                }
            }
        );
    }
};
//addTag ends

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

// This method adds tags from created content to the DB
module.exports.addTagsDB = function (tags) {
    Tag.insertMany(tags);
};
