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
        type: {},
    },
    start: {
        type: Date,
        require: true
    }
    // end: {
    //     type: Date
    // },
    // title: {
    //     type: String,
    //     require: true
    // },
    // color: {
    //     type: {}
    // },
    // actions: {
    //     type: [{}]
    // },
    // allDay: {
    //     type: Boolean
    // },
    // cssClass: {
    //     type: String
    // },
    // resizable: {
    //     type: {
    //         beforeStart: Boolean,
    //         afterEnd: Boolean
    //     }
    // },
    // draggable: {
    //     type: Boolean
    // },
    // meta: {
    //     type: {}
    // }
});
// ---------------------- End of Schemas ---------------------- //


// ---------------------- Models ---------------------- //
var CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);
// ---------------------- End of Models ---------------------- //
