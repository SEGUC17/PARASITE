var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nawwar');

var db = mongoose.connection;
var Schema = mongoose.Schema;

var VCRSchema = mongoose.Schema({
    AvatarLink: {
        trim: true,
        type: String
    },
    ProfileLink: {
        trim: true,
        type: String
    },
    RequestDate: {
        default: Date.now,
        type: Date
    },
    bio: {
        required: false,
        type: String
    },
    creator: {
        type: [
            {
                ref: 'User',
                type: Schema.Types.ObjectId
            }
        ],
        unique: true
    },
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

