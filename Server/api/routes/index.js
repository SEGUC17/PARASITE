var express = require('express');
var router = express.Router();

var ActivityController = require('../controllers/ActivityController');
var profileController = require('../controllers/ProfileController');
var contentController = require('../controllers/ContentController');
var adminController = require('../controllers/AdminController');


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
};

var isUnAuthenticated = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
};

module.exports = function (passport) {

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.send('Server Works');
  });

// --------------------- Activity Contoller -------------------- //
  router.get('/activities', ActivityController.getActivities);
  router.get('/activities/:activityId', ActivityController.getActivity);
  router.post('/activities', ActivityController.postActivity);
// --------------------- End of Activity Controller ------------ //

  // ---------------------- User Controller ---------------------- //
  router.post('/signup', isUnAuthenticated, passport.authenticate('local-signup'));
  router.post('/signin', isUnAuthenticated, passport.authenticate('local-signin'));
  // ---------------------- End of User Controller --------------- //

// -------------- Admin Contoller ---------------------- //
router.get('/admin/VerifiedContributerRequests', adminController.getVCRs);
router.get(
'/admin/PendingContentRequests',
adminController.viewPendingContReqs
);
router.patch(
'/admin/RespondContentRequest/:ContentRequestId',
adminController.respondContentRequest
);
  // --------------End Of Admin Contoller ---------------------- //


  //-------------------- Profile Module Endpoints ------------------//




  router.post('/profile/VerifiedContributerRequest',profileController.requestUserValidation);
  router.get('/profile/:parentId',profileController.getUserInfo);
  router.put('/profile/LinkAnotherParent/:parentId',profileController.linkAnotherParent);
  router.put('/profile/LinkAnotherParent/:parentId',profileController.Unlink);

//  router.get('/profile/:userId/getChildren', profileController.getProduct);
//------------------- End of Profile module Endpoints-----------//


  // --------------Content Module Endpoints---------------------- //
  router.get(
    '/content/getContentPage/:numberOfEntriesPerPage' +
    '/:pageNumber/:category/:section',
    contentController.getContentPage
  );
  router.get(
    '/content/numberOfContentPages/:numberOfEntriesPerPage/:category/:section',
    contentController.getNumberOfContentPages
  );

  module.exports = router;

  return router;
};

