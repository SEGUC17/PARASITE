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
  if (req.params.educationLevel !== 'NA') {
    toFind.educationLevel = req.params.educationLevel;
  }
  if (req.params.educationSystem !== 'NA') {
    toFind.educationSystem = req.params.educationSystem;
  }

  return toFind;
};
//Search for the parents by the specified parameters
module.exports.Search = function (req, res, next) {
  var toFind = {};
  var children = null;
  toFind = find(req);
  //if user is searching by education we'll find
  //children with specified edu first
  if (toFind.educationLevel || toFind.educationSystem) {
    children = {};
    User.find(
      {
        educationLevel: req.params.educationLevel,
        isChild: true
      }
      , function (err, users) {
        if (err) {
          return next(err);
        }
        children = users;
      }
    );
  }
  //narrowing down the search space by getting parents only
    toFind.isParent = true;


  //getting and paginating the results
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
      //if children is not null then we filter their parents
      if (children) {
      for (var child in children) {
        if (users.children.indexOf(child.username) > -1) {
         res.status(200).json({
          data: users,
          err: null,
          msg:
            'Users are retrievred successfully'
        });
       }
      }
    } else {
      res.status(200).json({
        data: users,
        err: null,
        msg:
          'Users are retrievred successfully'
      });
    }


    }
  );
};

