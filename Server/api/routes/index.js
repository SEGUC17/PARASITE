var express = require('express'),
ActivityController = require('../controllers/ActivityController');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Server Works');
});

router.get('/activities', ActivityController.getActivities );

module.exports = router;
