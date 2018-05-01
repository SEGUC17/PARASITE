var mongoose = require('mongoose');

var messagingSchema = mongoose.Schema({

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

recipientAvatar: { type: String },

sender: {
    lowercase: true,
    required: true,
    trim: true,
    type: String
},

senderAvatar: { type: String },

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
