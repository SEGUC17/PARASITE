var express = require('express');
var router = express.Router(),
  AddPsychReqCtrl = require('../controllers/AddPsychologistRequestController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Server Works');
});

router.get('/psychologist/request/add/addRequest', AddPsychReqCtrl.createRequest);

module.exports = router;
