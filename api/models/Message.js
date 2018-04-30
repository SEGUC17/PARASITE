var mongoose = require('mongoose');

var messagingSchema = mongoose.Schema({
avatar: {
    default: '',
    type: String
    },
body: {
    required: true,
    type: String
},

recipient: {
    lowercase: true,
    required: true,
    trim: true,
    type: String
},

sender: {
    lowercase: true,
    required: true,
    trim: true,
    type: String
},

sentAt: {
    default: Date.now,
    type: Date
},

state: {
    default: true,
    type: Boolean
}

});

mongoose.model('Message', messagingSchema, 'messages');
