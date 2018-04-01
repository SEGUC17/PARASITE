/* eslint-disable max-len */
/* eslint-disable max-statements */

var express = require('express');
var router = express.Router();

var ActivityController = require('../controllers/ActivityController');
var profileController = require('../controllers/ProfileController');
var contentController = require('../controllers/ContentController');
var studyPlanController = require('../controllers/StudyPlanController');
var adminController = require('../controllers/AdminController');
var scheduleController = require('../controllers/ScheduleController');


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
  router.get('/activities/:activityId', ActivityController.getActivity);
  router.post('/activities', ActivityController.postActivity);
  // --------------------- End of Activity Controller ------------ //

  // ---------------------- User Controller ---------------------- //
  router.post('/signup', isUnAuthenticated, passport.authenticate('local-signup'));
  router.post('/signin', isUnAuthenticated, passport.authenticate('local-signin'));
  // ---------------------- End of User Controller --------------- //

  //-------------------- Study Plan Endpoints ------------------//
  router.get('/study-plan/getPerosnalStudyPlans/:username', studyPlanController.getPerosnalStudyPlans);
  router.get('/study-plan/getPerosnalStudyPlan/:username/:studyPlanID', studyPlanController.getPerosnalStudyPlan);
  router.get('/study-plan/getPublishedStudyPlan/:studyPlanID', studyPlanController.getPublishedStudyPlan);
  router.patch('/study-plan/getPublishedStudyPlan/:username', studyPlanController.createStudyPlan);
  //------------------- End of Study Plan Endpoints-----------//

  // -------------- Admin Contoller ---------------------- //
  router.get('/admin/VerifiedContributerRequests', adminController.getVCRs);
  router.get('/admin/PendingContentRequests', adminController.viewPendingContReqs);
  router.patch('/admin/RespondContentRequest/:ContentRequestId', adminController.respondContentRequest);
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
  // router.get(
  //   '/profile/LinkAnotherParent/:parentID',
  //   profileController.linkAnotherParent
  // );


  //  router.get('/profile/:userId/getChildren', profileController.getProduct);
  //------------------- End of Profile module Endpoints-----------//

  // ---------------Schedule Controller Endpoints ---------------//
  router.patch('/schedule/SaveScheduleChanges/:username', scheduleController.updateSchedule);
  // ------------End of Schedule Controller Endpoints -----------//

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

