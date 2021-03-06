// ---------------------- Comments ---------------------- //
// Check The Following Website For All Schema Types Supported By Mongoose
// http://mongoosejs.com/docs/2.7.x/docs/schematypes.html
// ---------------------- End of Comments ---------------------- //


// ---------------------- Reuirements ---------------------- //
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var calendarEventSchema = mongoose.model('CalendarEvent').schema;
// ---------------------- End of Requiremenets ---------------------- //


// ---------------------- Schemas ---------------------- //
var studyPlanSchema = mongoose.Schema({
    assigned: {
        default: false,
        type: Boolean
    },
    creator: {
        required: true,
        trim: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    events: {
        required: true,
        type: [calendarEventSchema]
    },
    published: {
        default: false,
        type: Boolean
    },
    rating: {
        default: {
            number: 0,
            sum: 0,
            value: 0
        },
        type: {
            number: Number,
            sum: Number,
            value: Number
        }
    },
    title: {
        required: true,
        trim: true,
        type: String
    }
});
// ---------------------- End of Schemas ---------------------- //


// ---------------------- Plugins ---------------------- //
studyPlanSchema.plugin(mongoosePaginate);
// ---------------------- End of Plugins ---------------------- //


// ---------------------- Middlewares ---------------------- //
studyPlanSchema.post('findOneAndUpdate', function (doc) {
    var newRating = doc.rating.sum / doc.rating.number;
    this.model.update(
        { _id: doc._id },
        { $set: { 'rating.value': newRating } }
    ).exec();
});
// ---------------------- End of Middlewares ---------------------- //


// ---------------------- Models ---------------------- //
module.exports = mongoose.model('StudyPlan', studyPlanSchema, 'studyPlans');
// ---------------------- End of Models ---------------------- //
