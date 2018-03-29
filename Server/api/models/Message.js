const mongoose = require("mongoose");

var messagingSchema = mongoose.Schema({

body:{
    type: String,
    required: true,
},
sender:{
    type: String,
    required: true,
    trim:true,
    lowercase: true
},
recipient: {
    type: String,
    required: true,
    trim:true,
    lowercase:true
},
sentAt:{
    type:Date,
    default: Date.now
},
state: {  
    type: Boolean,
    default: true

}

});
mongoose.model('Messaging', messagingSchema);
