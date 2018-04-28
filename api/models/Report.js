var mongoose = require('mongoose');

var reportSchema = mongoose.Schema({

reason: {
    required: true,
    type: String
},

reportedAt: {
    default: Date.now,
    type: Date
},

reportedPerson: {
    lowercase: true,
    required: true,
    trim: true,
    type: String
},

reporter: {
    lowercase: true,
    required: true,
    trim: true,
    type: String
}

});

mongoose.model('Report', reportSchema, 'reports');
