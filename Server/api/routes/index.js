var express = require('express');
var router = express.Router();
var contentCtrl = require('../controllers/ContentController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Server Works');
});

/* content module endpoints*/
router.get(
  '/content/getContentPage/:numberOfEntriesPerPage' +
  '/:pageNumber/:category/:section',
  contentCtrl.getContentPage
);
router.get(
  '/content/numberOfContentPages/:numberOfEntriesPerPage/:category/:section',
  contentCtrl.getNumberOfContentPages
);

module.exports = router;
