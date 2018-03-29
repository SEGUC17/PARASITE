var mongoose = require('mongoose'),
mongoosePaginate = require('mongoose-paginate'),
isTimestamp = require('validate.io-timestamp'),
timestamps = require('mongoose-timestamp-date-unix');

var Schema = mongoose.Schema;

var activitySchema = Schema({
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
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'rejected', 'verified']
    },
    fromDateTime: {
        type: Number,
        required: true,
        validate: 
            [isTimestamp, 'Date has to be in unix format']
        
    },
    toDateTime: {
        type: Number,
        required: true,
        validate: [function(time){
            // Making sure that fromDate is less than toDate
            return isTimestamp(time) && this.fromDateTime <= time;
        }, 'fromDate has to be less than toDate']
   }    
});

// Adds CreatedAt, UpdatedAt fields in Unix format
activitySchema.plugin(timestamps);
activitySchema.plugin(mongoosePaginate);

var Activity = mongoose.model('Activity', activitySchema);
