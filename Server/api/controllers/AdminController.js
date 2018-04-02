/* eslint no-underscore-dangle: ["error", {"allow" : ["_id"]}] */

var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/nawwar');
var ContentRequest = mongoose.model('ContentRequest');
var VCR = require('../models/VerifiedContributerRequest');

var VCRmodel = mongoose.model('VerifiedContributerRequest');
var userModel = mongoose.model('User');

mongoose.connect('mongodb://localhost/nawwar');
mongoose.set('debug',true);


         //-------------------------------------------//
         //-------------------------------------------//

module.exports.respondContentRequest = function(req, res, next) {
    ContentRequest.findByIdAndUpdate(
    req.params.ContentRequestId,
    { $set: { status: req.body.str } },
    { new: true },
    function(err, updatedcontentrequest) {
        if (err) {
            console.log('cannot ' + req.body.str);

            return next(err);
        }

        return res.status(200).json({
            data: updatedcontentrequest,
            err: null,
            msg: updatedcontentrequest.contentTitle +
            ' request is now ' + req.body.str
        });
    }
);
};

         //-------------------------------------------//
module.exports.getVCRs = function(req, res, next) {
    var filteredVCRs = null;

    try {
        mongoose.connection.collection("VerifiedContributerRequest").find({}).toArray(function(err, result) {
            if (err) throw err;
            if (!req.user.isAdmin){
               return res.status(403).json({
                   err: null,
                   msg: 'you are not an admin',
                   data: null
               });
            }
            filteredVCRs = result.filter(function(request){
                return request.status === req.params.FilterBy;
            });
            console.log('retrieved all VCRs');
            return res.status(200).json({
                err: null,
                msg: 'VCRs retrieved successfully.',
                data: {dataField: filteredVCRs}
            });


        });
    }
    catch(e){
        res.status(500).json({
            err: null,
            msg: 'VCRs retrieval failed.',
            data: null
        });
        return;
    }


};

module.exports.VCRResponde = function(req, res, next) {

    if (!req.user.isAdmin){
        return res.status(403).json({
            err: null,
            msg: 'you are not an admin',
            data: null
        });
    }


    VCRmodel.update(
        { _id: req.params.targetId },
        { $set: { status: req.body.responce } },
        { new: false },
        function(err) {
            if (err) {
                console.log(err.msg);
                throw err;
            }
            console.log('1 document updated');
        });


    var userId = null;
    try {
        VCRmodel.find( { _id: req.params.targetId }).exec(function(err, result) {
            if (err) throw err;

           userId = result[0].creator;
           console.log(result);
            console.log('retrieved all VCRs' + userId);

            if ( req.body.responce == 'approved'){
                console.log('approving user');
                console.log('approving user');

                userModel.update(
                    {_id: userId},
                    { $set: { verified: true } },
                    {new: true},
                    function(err, res) {
                        if(err) {
                            console.log(err.msg);
                            throw err;
                        }
                        console.log("1 User approved updated");
                    });
            }
            if ( req.body.responce == 'disapproved'){
                console.log('disapproving user');
                userModel.update(
                    {_id: userId},
                    { $set: { verified: false } },
                    {new: true},
                    function(err, res) {
                        if(err) {
                            console.log(err.msg);
                            throw err;
                        }
                        console.log("1 User disapproved updated");
                    });
            }

        });
    }
    catch(e){
       console.log('error finding the user');
       console.log(e.message);
    }
}
