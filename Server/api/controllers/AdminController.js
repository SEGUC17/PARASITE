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

//------------------------------------------------------------------------//

<<<<<<< HEAD
module.exports.viewPendingReqs = function(req, res, next) {
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

//------------------------------------------------------------------------//
 module.exports.updateProduct = function(req, res, next) {
    ContentRequest.findByIdAndUpdate(
      req.params.productId,
      {
        $set: req.body
      },
      { new: true }
    ).exec(function(err, updatedProduct) {
      if (err) {
        return next(err);
      }
      if (!updatedProduct) {
        return res.status(404).json({
            data: null,
            err: null,
            msg: 'Product not found.'
             });
      }
      res.status(200).json({
        data: updatedProduct,
        err: null,
        msg: 'Product was updated successfully.'
      });
    });
  };
=======
//module.exports.getContentReqs = function(req, res, next) {
//    ContentRequest.find({}).exec(function(err, contentRequests) {
//      if (err) {
//        return next(err);
//      }
//      res.status(200).json({
//        data: contentRequests,
//        err: null,
//        msg: 'Products retrieved successfully.'
//      });
//    });
//  };

module.exports.getVCRs = function(req, res, next) {
    var allVCRs = VCR.getAll();

    res.status(200).json({
        err: null,
        msg: 'Products retrieved successfully.',
        data: allVCRs
    });
};
>>>>>>> 3d0a333ed854c7eed47c8a1ee6cfd181a1733cc9
