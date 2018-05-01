var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp-date-unix');

/*eslint max-statements: ["error", 20]*/
/* eslint multiline-comment-style: ["error", "starred-block"] */
/* eslint-disable sort-keys */

var Schema = mongoose.Schema;

var replySchema = Schema({

    /*
     * A schema for replies on comments
     *
     * @author: Wessam Ali
     */

     creator: {
         type: String,
         required: true
     },
     creatorInfo: {
         type: Schema.Types.ObjectId,
         ref: 'User'
     },
     text: {
         type: String,
         required: true,
         maxlength: 500
     }
});

// Adds CreatedAt, UpdatedAt fields in Unix format
replySchema.plugin(timestamps);

var commentSchema = Schema({

    /*
     * A schema of comments to be used in activities
     * and content
     *
     * @author: Wessam
     */
    creator: {
        type: String,
        required: true
    },
    creatorInfo: {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient'
    },
    text: {
        type: String,
        required: true,
        maxlength: 500
    },
    replies: { type: [replySchema] }
});

// Adds CreatedAt, UpdatedAt fields in Unix format
commentSchema.plugin(timestamps);

mongoose.model('Comment', commentSchema);
