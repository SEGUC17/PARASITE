var mongoose = require('mongoose');
var Tags = mongoose.model('Tag');

var newsfeedSchema = mongoose.Schema({
    metadata: {
        activityDate: Date,
        description: String,
        title: {
            required: true,
            type: String
        }
    },
    tags: [Tags],
    type: {
        enum: [
            'a',
            'c',
            's'
        ],
        required: true,
        type: String
    }
}, {
        capped: {
            max: 10000,
            // 1 KB * 1000 * 50 = 50 MB
            size: 1024 * 1024 * 50
        }
    });

newsfeedSchema.index(
    { tags: 1 },
    { name: 'tagsIndex' }
);

var feed = mongoose.model('Newsfeed', newsfeedSchema, 'newsfeed');

feed.ensureIndexes();
