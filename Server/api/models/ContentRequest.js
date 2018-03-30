var mongoose = require('mongoose');
var contentreqschema = mongoose.schema({
    contentID: {
        type: String
    },
    contentTitle: {
        required: true,
        trim: true,
        type: String
    },
    contentType: {
        enum: [
            'resource',
            'idea'
    ],
        type: String
    },
    creator: {
        trim: true,
        type: String
    },
    date: {
        default: Date.now,
        type: Date
    },
    status: {
        enum: [
            'approved',
            'disapproved',
            'pending'
    ],
        required: true,
        type: String
    }
});

var ContentRequest = mongoose.model('ContentRequest', contentreqschema);
