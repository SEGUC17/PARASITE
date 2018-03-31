/* eslint-disable max-len */
/* eslint-disable max-statements */

var express = require('express');
var router = express.Router();

var userController = require('../controllers/UserController');
var ActivityController = require('../controllers/ActivityController');
var profileController = require('../controllers/ProfileController');
var contentController = require('../controllers/ContentController');
var adminController = require('../controllers/AdminController');


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return next(new Error('User Is Logged In!'));
};

var isUnAuthenticated = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  return next(new Error('User Is Not Logged In!'));
};

module.exports = function (passport) {

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.send('Server Works');
  });

  // --------------------- Activity Contoller -------------------- //
  router.get('/activities', ActivityController.getActivities);
  // --------------------- End of Activity Controller ------------ //

  // ---------------------- User Controller ---------------------- //
  router.post('/signup', isUnAuthenticated, passport.authenticate('local-signup'), userController.signUp);
  router.post('/signin', isUnAuthenticated, passport.authenticate('local-signin'));
  // ---------------------- End of User Controller --------------- //

  // -------------- Admin Contoller ---------------------- //
  router.get('/admin/PendingContentRequests', adminController.viewPendingReqs);
  router.get('/admin/VerifiedContributerRequests', adminController.getVCRs);
  // --------------End Of Admin Contoller ---------------------- //


  //-------------------- Profile Module Endpoints ------------------//
  router.post('/profile/VerifiedContributerRequest', profileController.requestUserValidation);
  router.get('/profile/:username', profileController.getUserInfo);
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

