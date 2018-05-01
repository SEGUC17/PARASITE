var mongoose = require('mongoose');
var Newsfeed = mongoose.model('Newsfeed');

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

module.exports.getPosts = function (req, res) {
    Newsfeed.paginate(
        { tags: { $in: { name: req.body.tags } } },
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
