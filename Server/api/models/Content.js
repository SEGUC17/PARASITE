var mongoose = require('mongoose');
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
    creator: {
        trim: true,
        type: String
    },
    image: {
        trim: false,
        type: String
    },
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

var Content = mongoose.model('Content', contentSchema);
