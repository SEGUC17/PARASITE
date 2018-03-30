var express = require('express');
var router = express.Router();

var addPsychReqCtrl = require('../controllers/AddPsychologistRequestController');
var userController = require('../controllers/UserController');
var profileController = require('../controllers/ProfileController');
var contentController = require('../controllers/ContentController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Server Works');
});

// ------------- psychologist's requests Controller ------------- //
router.post('/psychologist/request/add/addRequest', addPsychReqCtrl.addRequest);

// ---------------------- User Controller ---------------------- //
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
// ---------------------- End of User Controller --------------- //

router.post(
  '/profile/VerifiedContributerRequest',
  profileController.requestUserValidation
);

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
