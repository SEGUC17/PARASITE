var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nawwar');

var db = mongoose.connection;
var Schema = mongoose.Schema;



var VCRSchema = mongoose.Schema({
    status: {
        enum: [
            'pending',
            'approved',
            'disapproved'
        ],
        type: String
    },
    bio: {
        required: false,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    AvatarLink: {
        trim: true,
        type: String
    },
    ProfileLink: {
        trim: true,
        type: String
    },
    image: {
        trim: false,
        type: String
    },
    RequestDate: {
        default: Date.now,
        type: Date
    },
    creator: {
        type: [
            { type: Schema.Types.ObjectId, ref: 'User' }
            ],
        unique: true
    }
});

var VerifiedContributerRequest = mongoose.model('VerifiedContributerRequest', VCRSchema, 'VerifiedContributerRequest');

module.exports.createVCR = function(VCR) {
    console.log(VCR);

    var vcr = new VerifiedContributerRequest(VCR);

    vcr.save(function (err, VcrAfter) {
        if (err) return err;
        console.log(VcrAfter.name + " saved to VCR collection.");
    });

}

