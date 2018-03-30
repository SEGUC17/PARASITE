var express = require('express'),
ActivityController = require('../controllers/ActivityController');
var router = express.Router();

var userController = require('../controllers/UserController');
var profileController = require('../controllers/ProfileController');
var contentController = require('../controllers/ContentController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Server Works');
});

router.get('/activities', ActivityController.getActivities );

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
