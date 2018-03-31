var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nawwar');

var db = mongoose.connection;

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
});

var VerifiedContributerRequest = mongoose.model('VerifiedContributerRequest', VCRSchema, 'VerifiedContributerRequest');

module.exports.createVCR = function(VCR) {
    console.log(VCR);

    var vcr = new VerifiedContributerRequest(VCR);

    vcr.save(function (err, VcrAfter) {
        if (err) return console.error(err);
        console.log(VcrAfter.name + " saved to VCR collection.");
    });

}

module.exports.update = function(id ,responce){
    var Query = {_id: id};
    var newvalue = { $set: { name: responce } };
    console.log('going to update the request status');
    db.collection("VerifiedContributerRequest").findByIdAndUpdate(id,newvalue,{new: true},function(err, res) {
        if (err) {
            throw err;
        }
        console.log(res.status);
        console.log("1 document updated");
        db.close();
    });

}


module.exports.getAll = function()  {


    db.collection("VerifiedContributerRequest").find({}).toArray(function(err, result) {
    if (err) throw err;

    var filteredVCRs = result.filter(function(request){
        return request.status == 'pending';
    });

    db.close();
    console.log(filteredVCRs);
    return filteredVCRs

    });

}



