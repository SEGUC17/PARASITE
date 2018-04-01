/* eslint-disable max-statements */

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
  router.post(
    '/signup',
    isUnAuthenticated,
    passport.authenticate('local-signup')
  );
  router.post(
    '/signin',
    isUnAuthenticated,
    passport.authenticate('local-signin')
  );
  // ---------------------- End of User Controller --------------- //

  // -------------- Admin Contoller ---------------------- //
  router.get('/admin/PendingContentRequests', adminController.viewPendingReqs);
  router.get('/admin/VerifiedContributerRequests', adminController.getVCRs);
  // --------------End Of Admin Contoller ---------------------- //


  //-------------------- Profile Module Endpoints ------------------//
  router.post(
    '/profile/VerifiedContributerRequest',
    profileController.requestUserValidation
  );
  router.get(
    '/profile/:username',
    profileController.getUserInfo
  );
  router.get(
    '/profile/LinkAnotherParent/:parentID',
    profileController.linkAnotherParent
  );
  //------------------- End of Profile module Endpoints-----------//

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

  //Content Production

  // Create new Content
  router.post('/content', contentController.createContent);


  // -------------------------------------------------------------------- //
  module.exports = router;

  return router;
};

