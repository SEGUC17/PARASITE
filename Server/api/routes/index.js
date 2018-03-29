var express = require('express');
var router = express.Router();
var passport = require('local-passport');

var userCtrl = require('../controllers/UserController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Server Works');
});


// ---------------------- User Controller ---------------------- //
router.post('/signup', userCtrl.signUp);
router.post('/signin', userCtrl.signIn);
// ---------------------- End of User Controller ---------------------- //


module.exports = router;
