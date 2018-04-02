var mongoose = require('mongoose');
 var User = mongoose.model('User');
 var StringValidate = require('../utils/validators/');

  module.exports.Search = function(req, res, next) {
    console.log(req.params.username);
    var pageN = Number(req.query.page);
    var valid = pageN && !isNaN(pageN);
    if (!valid) {
        pageN = 1;
    }
    User.paginate(
     {
      isParent: true,
      username: req.params.username
    },
      {
        limit: 10,
       page: pageN
      }
      , function(err, user) {
        if (err) {
          return next(err);
        }
        console.log(user);
        if (!user) {
          return res.status(422).json({
            data: null,
            err: 'the user info is invalid',
            msg: null
});
        }
        console.log("tamam");
        res.status(200).json({
          data: user,
          err: null,
          msg:
            'User with username ' +
            req.params.username + ' is retrievred successfully'
        });
  }
);
  };

  module.exports.FilterByLevelOfEducation = function(req, res, next) {
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
      }, function(err, user) {
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

  module.exports.getNumberOfPages = function(req, res, next) {
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
module.exports.getPage = function(req, res, next) {
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

  module.exports.FilterBySystemOfEducation = function(req, res, next) {
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
      }, function(err, user) {
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
