var mongoose = require('mongoose');
var Newsfeed = mongoose.model('Newsfeed');
var User = mongoose.model('User');

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

module.exports.findRandomFive = function (req, res, next) {
    var fields = { isParent: true };
    var options = {
        count: 5,
        limit: 5,
        skip: 10
    };
    User.findRandom(fields, options, function (err, users) {
        if (err) {
            return next(err);
        }

        res.status(200).json({
            data: users,
            err: null,
            msg: 'Users are retrieved successfully'
        });
    });
};

module.exports.getPosts = function (req, res) {
    console.log(req.body.tags);
    // tags: { $in: { name: req.body.tags } }
    Newsfeed.paginate(
        {},
        {
            limit: Number(req.params.entriesPerPage),
            page: Number(req.params.pageNumber)
        },
        function (err, posts) {
            if (err) {
                return err;
            }
            console.log(posts);
            res.status(200).json({
                data: posts,
                err: null,
                msg: 'posts retrieved successfully'
            });
        }
    );

};
