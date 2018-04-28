var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp-date-unix');
var REGEX = require('../utils/validators/REGEX');

mongoose.connect('mongodb://localhost/nawwar');

var db = mongoose.connection;
var Schema = mongoose.Schema;

var VCRSchema = mongoose.Schema({
    creator: {
        type: [
            {
                ref: 'User',
                type: Schema.Types.ObjectId
            }
        ],
        unique: true
    },
    email: {
      lowercase: true,
      match: REGEX.MAIL_REGEX,
      required: true,
      trim: true,
      type: String,
      unique: true
    },
    numberOfChildren: { type: Number },
    image: {
        trim: false,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    status: {
        enum: [
            'pending',
            'approved',
            'disapproved'
        ],
        type: String
    }
});

VCRSchema.plugin(timestamps);

var VerifiedContributerRequest = mongoose.model(
    'VerifiedContributerRequest',
    VCRSchema,
    'verifiedContributerRequests'
);

module.exports.createVCR = function (VCR) {
    console.log(VCR);

    var vcr = new VerifiedContributerRequest(VCR);

    vcr.save(function (err, VcrAfter) {
        if (err) {
            return err;
        }
    });

};

