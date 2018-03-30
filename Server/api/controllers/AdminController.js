var mongoose = require('mongoose');
var ContentRequest = mongoose.model('ContentRequest');

module.exports.test = function(req, res) {
    var testvalue = 'salma';
    res.status(200).json({
        data: testvalue,
        err: null,
        msg: 'AdminController work!'
    });
};


module.exports.getContentReqs = function(req, res, next) {
    ContentRequest.find({}).exec(function(err, contentRequests) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: contentRequests,
        err: null,
        msg: 'Products retrieved successfully.'
      });
    });
  };
