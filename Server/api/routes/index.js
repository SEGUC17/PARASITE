var express = require('express');
var router = express.Router();
var profileController = require('../controllers/profile-controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Server Works');
});

router.post(
  '/profile/VerifiedContributerRequest',
  profileController.requestUserValidation
  );

module.exports = router;
