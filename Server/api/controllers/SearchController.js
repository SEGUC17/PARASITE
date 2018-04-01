var mongoose = require('mongoose');
 var User = mongoose.model('User');
 var StringValidate = require('../utils/validators/');
  module.exports.getUsers = function(req, res, next) {
    User.find({}).exec(function(err, products) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: products,
        err: null,
        msg: 'Products retrieved successfully.'
      });
    });
  };
  module.exports.Search = function(req, res, next) {

    if (!StringValidate.isString(req.params.username)) {
      return res.status(422).json({
        data: null,
        err: null,
        msg: 'username must be valid'
  });
    }
    var pageN = Number(req.query.page);
    var valid = pageN && !isNaN(pageN);
    if (!valid) {
        pageN = 1;
    }
    User.paginate({
      limit: 10,
       page: pageN
      }, function(err, user) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(404).json({
            data: null,
            err: null,
            msg: 'User not found.'
            });
        }
        res.status(200).json({
          data: user,
          err: null,
          msg:
            'User with username ' +
            req.params.username + ' is retrievred successfully'
        });
  });
  };

  //to be altered
  module.exports.viewProfile = function(req, res, next) {
    User.findOne({ username: req.body.username }).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: user,
        err: null,
        msg:
          'User with username ' +
          req.params.username + ' is retrievred successfully'
      });
    });
  };

  module.exports.FilterByLevelOfEducation = function(req, res, next) {
    var pageN = Number(req.query.page);
    var valid = pageN && !isNaN(pageN);
    if (!valid) {
        pageN = 1;
    }
    User.paginate({
      educationLevels: req.body.educationLevels,
      isParent: true,
      limit: 10,
       page: pageN

      }, function(err, user) {
        if (!StringValidate.isString(req.body.educationLevels)) {
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
                req.params.educationLevels + ' is retrievred successfully'
            });
  });
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
    User.paginate({
      educationSystems: req.body.educationSystems,
      isParent: true,
      limit: 10,
       page: pageN
      }, function(err, user) {
        if (!StringValidate.isString(req.body.educationSystems)) {
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
                req.params.educationSystems + ' is retrievred successfully'
            });
  });
  };
