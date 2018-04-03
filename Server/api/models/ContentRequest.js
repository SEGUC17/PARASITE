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
    createdOn: {
        default: Date.now,
        type: Date
    },
    creator: {
        type: [
            {
                ref: 'User',
                type: Schema.Types.ObjectId
            }
        ]
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
    },
    updatedOn: { type: Date }
});

var ContentRequest = mongoose.model(
    'ContentRequest',
    contentreqschema,
    'ContentReuest'
);
