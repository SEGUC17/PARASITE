
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Server Works');
});
router.get('/Search/', SearchCtrl.getParents);

module.exports = router;
