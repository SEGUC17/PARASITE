var express = require('express');

var router = express.Router();
  
var ActivityController = require('../controllers/ActivityController');
var userController = require('../controllers/UserController');
/* eslint-disable max-len */

var express = require('express');
var router = express.Router();

var profileController = require('../controllers/ProfileController');
var contentController = require('../controllers/ContentController');
var passport = require('../passport/init');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
};

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Server Works');
});

// --------------------- Activity Contoller -------------------- //
router.get('/activities', ActivityController.getActivities );
router.post('/activities', ActivityController.postActivity);
// --------------------- End of Activity Controller ------------ //

// ---------------------- User Controller ---------------------- //
module.exports = function (passport) {
  router.post('/signup', passport.authenticate('local-signup'));
  router.post('/signin', passport.authenticate('local-signin'));
};
// ---------------------- End of User Controller --------------- //

// -------------- Admin Contoller ---------------------- //
//router.get('/admin/ContentRequests', adminController.test);

// --------------End Of Admin Contoller ---------------------- //


//-------------------- Profile Module Endpoints ------------------//
router.post(
'/profile/VerifiedContributerRequest', profileController.requestUserValidation);
router.get('/profile/:username', profileController.getUserInfo);
//------------------- End of Profile module Endpoints-----------//


// --------------Content Module Endpoints---------------------- //
router.get(
  '/content/getContentPage/:numberOfEntriesPerPage' +
  '/:pageNumber/:category/:section',
  contentController.getContentPage
);
router.get(
  '/content/numberOfContentPages/:numberOfEntriesPerPage/:category/:section',
  contentController.getNumberOfContentPages
);

module.exports = router;
