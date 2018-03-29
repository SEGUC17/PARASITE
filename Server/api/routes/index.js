
var express = require('express'),
 router = express.Router(),
 User = require('../models/User'),
 Searchctrl = require('../controllers/SearchController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Server Works');
});
router.get('./User/Search',Searchctrl.Search);

module.exports = router;
