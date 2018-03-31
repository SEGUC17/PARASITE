var mongoose = require('mongoose');
var ContentRequest = mongoose.model('ContentRequest');
var VCRmodel = mongoose.model('VerifiedContributerRequest');
mongoose.connect('mongodb://localhost/nawwar');
mongoose.set('debug',true);


         //-------------------------------------------//


module.exports.viewPendingReqs = function(req, res, next) {
   ContentRequest.find({}).exec(function(err, contentRequests) {
     if (err) {
       return next(err);
     }
     var pendingContentRequests = contentRequests.filter(function(request){
         return request.status === 'approved';
     });

     res.status(200).json({
       data: pendingContentRequests,
       err: null,
       msg: 'Requests retrieved successfully.'
     });
   });
 };

         //-------------------------------------------//
module.exports.getVCRs = function(req, res, next) {
    var filteredVCRs = null;
    try {
        mongoose.connection.collection("VerifiedContributerRequest").find({}).toArray(function(err, result) {
            if (err) throw err;

            filteredVCRs = result.filter(function(request){
                return request.status === req.params.FilterBy;
            });
            console.log('retrieved all VCRs');
            res.status(200).json({
                err: null,
                msg: 'VCRs retrieved successfully.',
                data: filteredVCRs
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

    VCRmodel.update(
        {_id: req.params.targetId},
        { $set: { status: req.body.responce } },
        {new: true},
        function(err, res) {
            if(err) {
                console.log(err.msg);
                throw err;
            }
            console.log("1 document updated");
        });


}
