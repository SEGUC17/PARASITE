var mongoose = require('mongoose'),
var isTimestamp = require('validate.io-timestamp'),
var timestamps = require('mongoose-timestamp-date-unix');

var Schema = mongoose.Schema;

var ActivitySchema = Schema({
    /*
        Activity Schema

        @author: Wessam
    */
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
            { type: Schema.Types.ObjectId, ref: 'User' }
        ]
    },
    fromDateTime: {
        type: Number,
        required: true,
        validate: {
            validator: function (time) {
                return isTimestamp(time);
            }
        }
    },
    toDateTime: {
        type: Number,
        required: true,
        validate: {
            validator: function (time) {
                return isTimestamp(time);
            }
        }
    }
});

// Adds CreatedAt, UpdatedAt fields in Unix format
ActivitySchema.plugin(timestamps);

mongoose.model('Activity', ActivitySchema);