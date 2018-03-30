
var express = require('express'),
 router = express.Router(),
 User = require('../models/User'),
 Searchctrl = require('../controllers/SearchController');

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
router.get('./User/Search',Searchctrl.Search);


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
