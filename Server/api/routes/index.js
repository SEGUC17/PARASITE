var express = require('express');
var router = express.Router();
var productCtrl = require('../controllers/ProductController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Server Works');
});
// --------------Product Controller---------------------- //
router.get('/market/getMarketPage/:numberOfEntriesPerPage/' +
':pageNumber', productCtrl.getMarketPage);
router.get(
'/market/numberOfMarketPages/:numberOfEntriesPerPage/',
productCtrl.getNumberOfMarketPages
);
router.get('/product/getProduct/:productId', productCtrl.getProduct);
router.post('/productrequest/createproduct', productCtrl.createProduct);
router.post('/productrequest/' +
'createProductRequest', productCtrl.createProductRequest);
router.get('/productrequest/evaluateRequest', productCtrl.evaluateRequest);
router.get('/productrequest/getRequests', productCtrl.getRequests);

// --------------End of Product Controller---------------------- //
module.exports = router;
