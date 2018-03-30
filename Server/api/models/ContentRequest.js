var mongoose = require('mongoose');
var contentreqschema = mongoose.Schema({
    contentID: { type: String },
    contentTitle: {
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
    requestType: {
        enum: [
            'create',
            'update'
        ],
        required: true,
        type: String
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
