// ---------------------- Comments ---------------------- //
// Check The Following Website For All Schema Types Supported By Mongoose
// http://mongoosejs.com/docs/2.7.x/docs/schematypes.html
// ---------------------- End of Comments ---------------------- //


// ---------------------- Reuirements ---------------------- //
var mongoose = require('mongoose');
// ---------------------- End of Requiremenets ---------------------- //


// ---------------------- Schemas ---------------------- //
var calendarEventSchema = mongoose.Schema({
    id: { 
        type: string | number,
    },
    start: {
        type: Date,
        require: true
    },
    end: {
        type: Date
    },
    title: {
        type: String,
        require: true
    },
    color: {
        type: Mixed
    },
    actions: {
        type: [any]
    },
    allDay: {
        type: Boolean
    },
    cssClass: {
        type: String
    },
    resizable: {
        beforeStart?: boolean,
        afterEnd?: boolean
    },
    draggable: {
        type: Boolean
    },
    meta: {
        type: Mixed
    }
});
// ---------------------- End of Schemas ---------------------- //


// ---------------------- Models ---------------------- //
var StudyPlan = mongoose.model('CalendarEvent', calendarEventSchema);
// ---------------------- End of Models ---------------------- //
