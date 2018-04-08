var mongoose = require('mongoose');
var User = mongoose.model('User');
// specifying the constsraints that will be added to the search parameters
var find = function (req) {
  var toFind = {};
  //if the params is not 'Not Applied' then it should be added to
  //the tofind otherwise it's not applied in the search space
  if (req.params.location !== 'NA') {
    toFind.address = req.params.location;
  }
  if (req.params.username !== 'NA') {
    toFind.username = req.params.username;
  }

  return toFind;
};
//Search for the parents by the specified parameters
module.exports.Search = function (req, res, next) {
  var toFind = {};
  var children = [];
  toFind = find(req);
  //if user is searching by education we'll find
  //children with specified edu first
  if (req.params.educationLevel !== 'NA') {
    User.find({
      educationLevel: req.params.educationLevel,
      isChild: true
    }, function (err, users) {
      if (err) {
        return next(err);
      }
      for (var user in users.docs) {
        if (user) {
          children.push(user.username);
        }
      }
    });
  }
  if (req.params.educationSystem !== 'NA') {
    User.find({
      educationSystem: req.params.educationSystem,
      isChild: true
    }, function (err, users) {
      if (err) {
        return next(err);
      }
      for (var user in users.docs) {
        if (user) {
          children.push(user.username);
        }
      }
    });
  }
  //narrowing down the search space by getting parents only
  toFind.isParent = true;
  //getting and paginating the results
  User.paginate(
    toFind, {
      limit: Number(req.params.pp),
      page: Number(req.params.curr)
    },
    function (err, users) {
      if (err) {
        return next(err);
      }
      if (req.params.educationLevel !== 'NA' ||
        req.params.educationSystem !== 'NA') {
        for (var user in users.docs) {
          if (!user.children ||
            !children.includes(user.children, 0)) {
            users.docs.splice(users.docs.lastIndexOf(user), 1);
          }
        }
        res.status(200).json({
          data: users,
          err: null,
          msg: 'Users are retrievred successfully'
        });
      } else {
        res.status(200).json({
          data: users,
          err: null,
          msg: 'Users are retrievred successfully'
        });
      }


    }
  );
};
