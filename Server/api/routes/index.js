var express = require('express');
var router = express.Router();

var userController = require('../controllers/UserController');
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


  return res.status(401).json({
    data: null,
    error: null,
    msg: 'User Is Not Signed In!'
  });
};

var isNotAuthenticated = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }


  return res.status(403).json({
    data: null,
    error: null,
    msg: 'User Is Already Signed In!'
  });

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
  router.put('/unverifiedActivities'), ActivityController.reviewActivity;
// --------------------- End of Activity Controller ------------ //

  // ---------------------- User Controller ---------------------- //
  router.post('/signup', isNotAuthenticated, passport.authenticate('local-signup'), userController.signUp);
  router.post('/signin', isNotAuthenticated, passport.authenticate('local-signin'), userController.signIn);
  router.get('/signout', isAuthenticated, function (req, res) {
    req.logout();

    return res.status(200).json({
      data: null,
      error: null,
      msg: 'Sign Out Successfully!'
    });
  });
  // ---------------------- End of User Controller --------------- //

  //-------------------- Study Plan Endpoints ------------------//
  router.get('/study-plan/getPersonalStudyPlans/:username', studyPlanController.getPerosnalStudyPlans);
  router.get('/study-plan/getPublishedStudyPlans/:pageNumber', studyPlanController.getPublishedStudyPlans);
  router.get('/study-plan/getPersonalStudyPlan/:username/:studyPlanID', studyPlanController.getPerosnalStudyPlan);
  router.get('/study-plan/getPublishedStudyPlan/:studyPlanID', studyPlanController.getPublishedStudyPlan);
  router.patch('/study-plan/createStudyPlan/:username', studyPlanController.createStudyPlan);
  router.post('/study-plan/PublishStudyPlan', studyPlanController.PublishStudyPlan);
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
  router.post('/profile/VerifiedContributerRequest',profileController.requestUserValidation);
  router.get('/profile/:parentId',profileController.getUserInfo);
  router.put('/profile/LinkAnotherParent/:parentId',profileController.linkAnotherParent);
//  router.get('/profile/:userId/getChildren', profileController.getProduct);
//------------------- End of Profile module Endpoints-----------//


  //  router.get('/profile/:userId/getChildren', profileController.getProduct);
  //------------------- End of Profile module Endpoints-----------//


  // ---------------Schedule Controller Endpoints ---------------//

  router.patch('/schedule/SaveScheduleChanges/:username', scheduleController.updateSchedule);
  router.get('/schedule/getPersonalSchedule/:username', scheduleController.getPersonalSchedule); //check name of method in controller

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
