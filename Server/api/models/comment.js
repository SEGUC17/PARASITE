var mongoose = require('mongoose');
var isTimestamp = require('validate.io-timestamp');
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

     text: {
         type: String,
         required: true,
         maxlength: 500
     }
});


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

    text: {
        type: String,
        required: true,
        maxlength: 500
    },
    replies: { type: [replySchema] }
});
