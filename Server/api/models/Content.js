var mongoose = require('mongoose');
// use the mongoose-paginate library to store contents in pages
var mongoosePaginate = require('mongoose-paginate');
// TODO: Omit creator specific schema [ProfileDependency | AuthDependency]
var contentSchema = mongoose.Schema({
    approved: {
        required: true,
        type: Boolean
    },
    body: {
        required: true,
        trim: false,
        type: String
    },
    category: {
        required: true,
        trim: true,
        type: String
    },
    creator: {
        trim: true,
        type: String
    },
    image: {
        trim: false,
        type: String
    },
    rating: {
        default: {
            number: 0,
            sum: 0,
            value: 0
        },
        type: {
            number: Number,
            sum: Number,
            value: Number
        }
    },
    section: {
        required: true,
        trim: true,
        type: String
    },
    tags: { type: [String] },
    title: {
        required: true,
        trim: true,
        type: String
    },
    touchDate: {
        default: Date.now,
        type: Date
    },
    type: {
        default: 'resource',
        enum: [
            'resource',
            'idea'
        ],
        type: String
    },
    update: {
        trim: true,
        type: String
    },
    video: {
        trim: true,
        type: String
    }
});

contentSchema.index(
    {
        tags: 'text',
        title: 'text'
    },
    {
        name: 'ContentTextIndex',
        weights: {
            tags: 10,
            title: 15
        }
    }
);

// apply the mongoose paginate library to the schema
contentSchema.plugin(mongoosePaginate);
var Content = mongoose.model('Content', contentSchema, 'contents');

Content.ensureIndexes();
