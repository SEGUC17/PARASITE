// ---------------------- Comments ---------------------- //
// Check The Following Website For All Schema Types Supported By Mongoose
// http://mongoosejs.com/docs/2.7.x/docs/schematypes.html
// ---------------------- End of Comments ---------------------- //


// ---------------------- Reuirements ---------------------- //
var mongoose = require('mongoose');
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
    title: {
        required: true,
        trim: true,
        type: String
    }
});
// ---------------------- End of Schemas ---------------------- //


// ---------------------- Models ---------------------- //
var StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
// ---------------------- End of Models ---------------------- //
