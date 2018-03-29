var express = require('express');
var router = express.Router();
//var msgCtrl = require('../controllers/MessageController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Server Works');
});

//router.post('/message/sendMessage', msgCtrl.sendMessage);

module.exports = router;
