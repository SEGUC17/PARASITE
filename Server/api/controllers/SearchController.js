var mongoose = require('mongoose');
var User = mongoose.model('User');
var StringValidate = require('../utils/validators/');
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
// var level = function (req, res, next) {
//   var toFind = {};
//   toFind = find(req);
//   var ret = null;
//   User.find(
//     {
//        educationLevel: toFind.educationLevel,
//     isChild: true
//   }
//     , function(err, user) {
//       if (err) {
//         return next(err);
//       }
//       res.status(200).json({
//         data: user,
//         err: null,
//         msg:
//           'User with username ' +
//           req.params.username + ' is retrievred successfully'
//       });
//       ret = user.educationLevel;
//   }
// );

// return ret;
// };
module.exports.Search = function (req, res, next) {
  var pageN = Number(req.query.page);
  var valid = pageN && !isNaN(pageN);
  if (!valid) {
    pageN = 1;
  }
  var toFind = {};
  toFind = find(req);
  if ((toFind.educationLevel || toFind.educationSystem) && !toFind.username) {
    toFind.isChild = true;
   } else {
      toFind.isParent = true;
    }


  // toFind.educationLevel = level(req, res, next);

  User.paginate(
    toFind,
    {
      limit: 10,
      page: pageN
    }
    , function (err, users) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: users,
        err: null,
        msg:
          'User with username ' +
          req.params.username + ' is retrievred successfully'
      });
    }
  );

};

module.exports.FilterByLevelOfEducation = function (req, res, next) {
  var pageN = Number(req.query.page);
  var valid = pageN && !isNaN(pageN);
  if (!valid) {
    pageN = 1;
  }
  User.paginate(
    {
      educationLevels: req.params.level,
      isParent: true
    },
    {
      limit: 10,
      page: pageN
    }, function (err, user) {
      if (!StringValidate.isString(req.params.level)) {
        return res.status(422).json({
          data: null,
          err: null,
          msg: 'Level Of Education must be valid'
        });
      }
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: user,
        err: null,
        msg:
          'User that has children with education levels ' +
          req.params.level + ' is retrievred successfully'
      });
    }
  );
};

module.exports.getNumberOfPages = function (req, res, next) {
  User.find().count().
    exec(function (err, count) {
      var numberOfPages =
        Math.ceil(count / req.params.NPP);

      if (err) {
        return next(err);
      }

      return res.status(200).json({
        data: numberOfPages,
        err: null,
        msg: 'Number of pages was retrieved'
      });
    });
};
module.exports.getPage = function (req, res, next) {
  var pageNumber = req.params.page;
  var numberOfEntriesPerPage = req.params.numberPerPage;
  User.find().skip((pageNumber - 1) * numberOfEntriesPerPage).
    limit(numberOfEntriesPerPage).
    exec(function (err, parents) {
      if (err) {
        return next(err);
      }

      return res.status(200).json({
        data: parents,
        err: null,
        msg: 'Page retrieved successfully'
      });

    });
};

module.exports.FilterBySystemOfEducation = function (req, res, next) {
  var pageN = Number(req.query.page);
  var valid = pageN && !isNaN(pageN);
  if (!valid) {
    pageN = 1;
  }
  User.paginate(
    {
      educationSystems: req.params.system,
      isParent: true
    },
    {
      limit: 10,
      page: pageN
    }, function (err, user) {
      if (!StringValidate.isString(req.params.system)) {
        return res.status(422).json({
          data: null,
          err: null,
          msg: 'Level Of Education must be valid'
        });
      }
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: user,
        err: null,
        msg:
          'User that has children with education levels ' +
          req.params.system + ' is retrievred successfully'
      });
    }
  );
};
