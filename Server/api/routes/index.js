var express = require('express');
var router = express.Router();

var userController = require('../controllers/UserController');
var profileController = require('../controllers/ProfileController');
var contentController = require('../controllers/ContentController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Server Works');
});


// ---------------------- User Controller ---------------------- //
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
// ---------------------- End of User Controller --------------- //

router.post(
  '/profile/VerifiedContributerRequest',
  profileController.requestUserValidation
);

// --------------Content Module Endpoints---------------------- //

// Content Management

// Create a category
router.post('/content/category', contentController.createCategory);
// Create a section

router.patch(
  '/content/category/:id/section',
  contentController.createSection
);

//Category retrieval
router.get('/content/category', contentController.getCategories);


// Content Retrieval

// Get a number of content pages
router.get(
  '/content/numberOfContentPages/:numberOfEntriesPerPage/:category/:section',
  contentController.getNumberOfContentPages
);

// Get a page of content
router.get(
  '/content/getContentPage/:numberOfEntriesPerPage' +
  '/:pageNumber/:category/:section',
  contentController.getContentPage
);

// Get a a certain content by ID
router.get('/content/view/:id', contentController.getContentById);


// Get the contents of a user
router.get(
  '/content/username/:creator/:pageSize/:pageNumber',
  contentController.getContentByCreator
);

//Get the total number of contents of a user
router.get(
  '/content/username/count/:creator',
  contentController.getNumberOfContentByCreator
);

//Content Production

// Create new Content
router.post('/content', contentController.createContent);


// -------------------------------------------------------------------- //

module.exports = router;
