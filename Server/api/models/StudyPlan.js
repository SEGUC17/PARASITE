// ---------------------- Comments ---------------------- //
// Check The Following Website For All Schema Types Supported By Mongoose
// http://mongoosejs.com/docs/2.7.x/docs/schematypes.html
// ---------------------- End of Comments ---------------------- //


// ---------------------- Reuirements ---------------------- //

var calendarEventSchema = mongoose.model('CalendarEvent').schema;
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
// ---------------------- End of Requiremenets ---------------------- //


// ---------------------- Schemas ---------------------- //
var studyPlanSchema = mongoose.Schema({
    title: {
        required: true,
        trim: true,
        type: String
    },
    creator: {
        required: true,
        trim: true,
        type: String
    },
    events: {
        required: true,
        type: [calendarEventSchema]
    },
    description: {
        required: true,
        type: String
    },
    assigned: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: false
    }
});
// ---------------------- End of Schemas ---------------------- //


studyPlanSchema.plugin(mongoosePaginate);

// ---------------------- Models ---------------------- //
var StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
// ---------------------- End of Models ---------------------- //
