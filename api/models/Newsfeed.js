var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Tags = mongoose.model('Tag').schema;

var newsfeedSchema = mongoose.Schema({
    contentID: String,
    metadata: {
        activityDate: Date,
        description: String,
        image: {
            trim: true,
            type: String
        },
        title: {
            required: true,
            type: String
        }
    },
    tags: {
        type: [Tags],
        unique: false
    },
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
newsfeedSchema.plugin(mongoosePaginate);
var feed = mongoose.model('Newsfeed', newsfeedSchema, 'newsfeed');

feed.ensureIndexes();
