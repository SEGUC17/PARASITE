var express = require('express'),
  passport = require('passport');

var router = express.Router();
  
var ActivityController = require('../controllers/ActivityController');
var userController = require('../controllers/UserController');
var profileController = require('../controllers/ProfileController');
var contentController = require('../controllers/ContentController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Server Works');
});

// --------------------- Activity Contoller -------------------- //
router.get(
  '/activities',
  ActivityController.getActivities );
// --------------------- End of Activity Controller ------------ //

// ---------------------- User Controller ---------------------- //
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
// ---------------------- End of User Controller --------------- //


//-------------------- Profile Module Endpoints ------------------//
router.post('/profile/VerifiedContributerRequest',profileController.requestUserValidation);
router.get('/profile/:username',profileController.getUserInfo);
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
