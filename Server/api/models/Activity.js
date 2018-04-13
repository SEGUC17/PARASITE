var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var isTimestamp = require('validate.io-timestamp');
var timestamps = require('mongoose-timestamp-date-unix');

var comment = mongoose.model('Comment');
var commentSchema = comment.schema;

/*eslint max-statements: ["error", 20]*/
/* eslint multiline-comment-style: ["error", "starred-block"] */
/* eslint-disable sort-keys */

var Schema = mongoose.Schema;

var activitySchema = Schema({

    /*
     *  Activity Schema
     *
     *   @author: Wessam
     */
    creator: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 30
    },
    description: {
        type: String,
        maxlength: 300
    },
    bookedBy: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: [
            'pending',
            'rejected',
            'verified'
        ]
    },
    fromDateTime: {
        type: Number,
        required: true,
        validate:
            [
                isTimestamp,
                'Date has to be in unix format'
            ]
    },
    toDateTime: {
        type: Number,
        required: true,
        validate: [
            function(time) {
                // Making sure that fromDate is less than toDate
                return isTimestamp(time) && this.fromDateTime <= time;
        },
        'fromDate has to be less than toDate'
    ]
   },
   image: {
       data: Buffer,
       type: String
   },
   discussion: { type: [commentSchema] }
});

// Adds CreatedAt, UpdatedAt fields in Unix format
activitySchema.plugin(timestamps);
activitySchema.plugin(mongoosePaginate);

var Activity = mongoose.model('Activity', activitySchema, 'activities');
