var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var contentreqschema = mongoose.Schema({
    contentID: {
        type: [
            {
            ref: 'Content',
            type: Schema.Types.ObjectId
            }
        ]
    },
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
        type: [
            {
                ref: 'User',
                type: Schema.Types.ObjectId
            }
        ]
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
     default: 'pending',
     enum: [
            'approved',
            'disapproved',
            'pending'
    ],
        type: String
    }
});

var ContentRequest = mongoose.model('ContentRequest', contentreqschema);
