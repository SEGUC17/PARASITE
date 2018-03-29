var express = require('express');
var router = express.Router();
var profileController = require('../controllers/profile-controller');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Server Works');
});



router.get('/profile/:userId/getChildren', profileController.getProduct);

module.exports = router;
