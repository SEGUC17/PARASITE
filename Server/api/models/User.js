/* eslint-disable consistent-this */
// -------------------------- Comments ----------------------------------- //
// Check The Following Website For All Schema Types Supported By Mongoose
// http://mongoosejs.com/docs/2.7.x/docs/schematypes.html
// -------------------------- End of "Comments" -------------------------- //


// -------------------------- Reuirements -------------------------------- //
require('./CalendarEvent.js');
require('./StudyPlan.js');
var config = require('../config/config');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var encryption = require('../utils/encryption/encryption');
// -------------------------- End of "Requiremenets" --------------------- //


// -------------------------- Variables Dependancies --------------------- //
var calendarEventSchema = mongoose.model('CalendarEvent').schema;
var studyPlanSchema = mongoose.model('StudyPlan').schema;
// -------------------------- End of "Variables Dependancies" ------------ //


// -------------------------- Schemas ------------------------------------ //
var userSchema = mongoose.Schema({
    address: {
        index: true,
        lowercase: true,
        sparse: true,
        type: String
    },
    avatar: {
        default: '',
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
    educationLevel: {
      default: '',
      required: false,
      type: String
    },
    educationSystem: {
      default: '',
      required: false,
      type: String
    },
    email: {
        lowercase: true,
        match: config.EMAIL_REGEX,
        required: true,
        trim: true,
        type: String,
        unique: true
    },
    firstName: {
        index: true,
        required: true,
        sparse: true,
        type: String
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
    lastName: {
        index: true,
        required: true,
        sparse: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    phone: {
        match: config.PHONE_REGEX,
        required: true,
        trim: true,
        type: [String]
    },
    schedule: {
        default: [],
        type: [calendarEventSchema]
    },
    studyPlans: {
        default: [],
        type: [studyPlanSchema]
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
// -------------------------- End of "Schemas" --------------------------- //


// -------------------------- Hash Password ------------------------------ //
userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        encryption.hashPassword(user.password, function (err, hash) {
            if (err) {
                return next(err);
            }

            user.password = hash;

            return next();
        });
    }
});
// -------------------------- End of "Hash Password" --------------------- //


// -------------------------- Compare Password --------------------------- //
userSchema.methods.comparePasswords = function (password, next) {
    encryption.comparePasswordToHash(password, this.password, function (
        err,
        passwordMatches
    ) {
        if (err) {
            return next(err);
        }

        return next(null, passwordMatches);
    });
};
// -------------------------- End of "Compare Password" ------------------ //


// -------------------------- Models ------------------------------------- //
userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', userSchema, 'users');
// -------------------------- End of "Models" ---------------------------- //
