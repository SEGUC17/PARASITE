var mongoose = require('mongoose');
var Newsfeed = mongoose.model('Newsfeed');
var User = mongoose.model('User');
var Tag = mongoose.model('Tag');
module.exports.addToNewsfeed = function (data) {
    switch (data.type) {
        case 'a':
        case 'c':
        case 's': Newsfeed.create(data, function (err) {
            if (err) {
                return err;
            }

            return 1;
        });
            break;
        default: return -1;
    }
};

module.exports.updateContentPost = function (content) {
    Tag.findOne(
        { 'name': content.category },
        function (err, tag) {
            if (tag && !err) {
                Newsfeed.findOneAndUpdate(
                    { contentID: content._id },
                    {
                        $set: {
                            metadata: {
                                activityDate: content.touchDate,
                                description: content.body,
                                image: content.image,
                                title: content.title
                            },
                            tags: [tag]
                        }
                    }
                );
            }

        }
    );
};
module.exports.findRandomFive = function (req, res, next) {
    User.findRandom(
        { isParent: true },
        {},
        { limit: 5 },
        function (randomError, users) {
            if (randomError) {
                return next(randomError);
            }

            return res.status(200).json({
                data: users,
                err: null,
                msg: 'Users are retrieved successfully'
            });
        }
    );
};

module.exports.getPosts = function (req, res) {
    Newsfeed.paginate(
        { tags: { $in: req.body.tags } },
        {
            limit: Number(req.params.entriesPerPage),
            page: Number(req.params.pageNumber)
        },
        function (err, posts) {
            if (err) {
                return err;
            }
            res.status(200).json({
                data: posts,
                err: null,
                msg: 'posts retrieved successfully'
            });
        }
    );

};

module.exports.deleteInterest = function (req, res) {
    User.update(
        { _id: req.user._id },
        { $pull: { interests: { $in: [req.params.interestText] } } },
        function (err, user) {
            console.log('inside the callback function');
            if (err) {
                throw err;
            } else if (!user) {
                return res.status(404).json({
                    data: null,
                    err: null,
                    msg: 'User couldn\'t be found'
                });
            }

            return res.status(200).json({
                data: req.user.interests,
                err: null,
                msg: 'interest was deleted'
            });
            // user does not exist
        }
    );
};

module.exports.addInterest = function (req, res) {
    User.update(
        { _id: req.user._id },
        { $push: { interests: req.body.text } },
        function (err, user) {
            console.log('inside the callback function');
            if (err) {
                throw err;
            } else if (!user) {
                return res.status(404).json({
                    data: null,
                    err: null,
                    msg: 'User couldn\'t be found'
                });
            }

            return res.status(200).json({
                data: user.interests,
                err: null,
                msg: 'interest was deleted'
            });
            // user does not exist
        }
    );

};
