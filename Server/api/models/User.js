// ---------------------- Comments ---------------------- //
// Check The Following Website For All Schema Types Supported By Mongoose
// http://mongoosejs.com/docs/2.7.x/docs/schematypes.html
// ---------------------- End of Comments ---------------------- //


// ---------------------- Reuirements ---------------------- //
var mongoose = require('mongoose');
// ---------------------- End of Requiremenets ---------------------- //


// ---------------------- Schemas ---------------------- //
var userSchema = mongoose.Schema({
    address: {
        index: true,
        lowercase: true,
        sparse: true,
        type: String
    },
    birthdate: {
        required: true,
        type: Date
    },
    children: {
        default: [],
        required: false,
        type: [String]
    },
    educationLevels: {
      default: [],
      required: false,
      type:[String]
    },
    educationSystems:{
      default: [],
      required: false,
      type:[String]
    },
    email: {
        lowercase: true,
        match: /\S+@\S+\.\S+/,
        required: true,
        trim: true,
        type: String,
        unique: true
    },
    isAdmin: {
        default: false,
        type: Boolean
    },
    isChild: {
        default: false,
        type: Boolean
    },
    isParent: {
        default: false,
        type: Boolean
    },
    isTeacher: {
        default: false,
        type: Boolean
    },
    password: {
        required: true,
        trim: true,
        type: String,
        unique: true
    },
    phone: {
        match: /^\d+$/,
        required: true,
        trim: true,
        type: [String]
    },
    username: {
        index: true,
        lowercase: true,
        required: true,
        sparse: true,
        trim: true,
        type: String,
        unique: true
    },
    verified: {
        default: false,
        type: Boolean
    }
});
// ---------------------- End of Schemas ---------------------- //


// ---------------------- Models ---------------------- //
var User = mongoose.model('User', userSchema);
// ---------------------- End of Models ---------------------- //
