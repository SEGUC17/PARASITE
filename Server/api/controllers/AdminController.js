var mongoose = require('mongoose');
var ContentRequest = mongoose.model('ContentRequest');
var VCR = require('../models/VerifiedContributerRequest');

module.exports.test = function(req, res) {
    res.status(200).json({
        data: 'Perfection',
        err: null,
        msg: 'AdminController works!'
    });
};

         //-------------------------------------------//


module.exports.viewPendingContReqs = function(req, res, next) {
   ContentRequest.find({}).exec(function(err, contentRequests) {
     if (err) {
       return next(err);
     }
     var pendingContentRequests = contentRequests.filter(r => r.status=='pending');

     res.status(200).json({
       data: pendingContentRequests,
       err: null,
       msg: 'Requests retrieved successfully.'
     });
   });
 };

         //-------------------------------------------//

module.exports.getVCRs = function(req, res, next) {
    var allVCRs = VCR.getAll();

    res.status(200).json({
        err: null,
        msg: 'VCRs retrieved successfully.',
        data: allVCRs
    });
};
