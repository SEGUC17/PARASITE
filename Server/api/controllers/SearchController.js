var mongoose = require('mongoose');
var User = mongoose.model('User');
var find = function (req) {
  var toFind = {};
  if (req.params.location !== 'NA') {
    toFind.address = req.params.location;
  }
  if (req.params.username !== 'NA') {
    toFind.username = req.params.username;
  }
  if (req.params.educationLevel !== 'NA') {
    toFind.educationLevel = req.params.educationLevel;
  }
  if (req.params.educationSystem !== 'NA') {
    toFind.educationSystem = req.params.educationSystem;
  }

  return toFind;
};
module.exports.Search = function (req, res, next) {
  var toFind = {};
  toFind = find(req);
  if ((toFind.educationLevel || toFind.educationSystem) &&
   !toFind.username && !toFind.address) {
    toFind.isChild = true;
   } else {
      toFind.isParent = true;
    }
  User.paginate(
    toFind,
    {
      limit: Number(req.params.pp),
      page: Number(req.params.curr)
    }
    , function (err, users) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: users,
        err: null,
        msg:
          'Users are retrievred successfully'
      });
    }
  );
};
