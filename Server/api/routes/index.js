var express = require('express');
var router = express.Router();
var passport = require('local-passport');

var userController = require('../controllers/UserController');
var profileController = require('../controllers/profile-controller');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Server Works');
});


// ---------------------- User Controller ---------------------- //
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
// ---------------------- End of User Controller ---------------------- //

router.post(
  '/profile/VerifiedContributerRequest',
  profileController.requestUserValidation
);

module.exports = router;
