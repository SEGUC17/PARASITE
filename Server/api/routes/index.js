var express = require('express');
var router = express.Router();
productCtrl = require('../controllers/ProductController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Server Works');
});

router.post('/productrequest/createproduct', productCtrl.createProduct);
router.post('/productrequest/createProductRequest', productCtrl.createProductRequest);

// router.get('/productrequest/evaluateRequest', productCtrl.evaluateRequest);
router.get('/productrequest/getRequests', productCtrl.getRequests);

module.exports = router;

