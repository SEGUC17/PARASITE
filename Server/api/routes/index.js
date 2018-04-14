
/* eslint-disable max-len */
/* eslint-disable max-statements */


var express = require('express');
var router = express.Router();
var User = require('../models/User');

var SearchController = require('../controllers/SearchController');

var psychCtrl = require('../controllers/PsychologistController');
var productCtrl = require('../controllers/ProductController');
var userController = require('../controllers/UserController');
var ActivityController = require('../controllers/ActivityController');
var profileController = require('../controllers/ProfileController');
var contentController = require('../controllers/ContentController');
var adminController = require('../controllers/AdminController');
var studyPlanController = require('../controllers/StudyPlanController');
var messageController = require('../controllers/MessageController');
var scheduleController = require('../controllers/ScheduleController');
var DiscussionController = require('../controllers/DiscussionController');

module.exports = function (passport) {

  // --------------------- Authentication Checkers --------------- //
  var optionalAuthentication = function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
      if (err) {
        return next(err);
      }
      req.user = user;

      return next();
    })(req, res, next);
  };

  var isAuthenticated = function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
      if (err) {
        return next(err);
      } else if (!user) {
        return res.status(401).json({
          data: null,
          error: null,
          msg: 'User Is Not Signed In!'
        });
      }
      req.user = user;

      return next();
    })(req, res, next);
  };

  var isNotAuthenticated = function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
      if (err) {
        return next(err);
      } else if (user) {
        return res.status(403).json({
          data: null,
          error: null,
          msg: 'User Is Already Signed In!'
        });
      }

      return next();
    })(req, res, next);
  };
  // --------------------- End of "Authentication Checkers" ------ //

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.send('Server Works');
  });

  // --------------------- Search Contoller -------------------- //
  router.get('/User/Search/:username/:educationLevel/:educationSystem/:location/:curr/:pp', isAuthenticated, SearchController.Search);
  // --------------------- End of Search Controller ------------ //

  // --------------------- Activity Contoller -------------------- //
  router.get('/activities', optionalAuthentication, ActivityController.getActivities);
  router.get('/activities/:activityId', optionalAuthentication, ActivityController.getActivity);
  router.get(
    '/activities/:activityId/comments/:commentId',
    optionalAuthentication,
    ActivityController.prepareActivity,
    DiscussionController.getComment
  );
  router.post(
    '/activities/:activityId/comments',
    isAuthenticated,
    ActivityController.prepareActivity,
    DiscussionController.postComment
  );
  router.post(
    '/activities/:activityId/comments/:commentId/replies',
    isAuthenticated,
    ActivityController.prepareActivity,
    DiscussionController.postCommentReply
  );
  router.post('/activities', isAuthenticated, ActivityController.postActivity);
  router.delete(
    '/activities/:activityId/comments/:commentId',
    isAuthenticated,
    ActivityController.deleteActivityComment
  );
  router.delete(
    '/activities/:activityId/comments/:commentId/replies/:replyId',
    isAuthenticated,
    ActivityController.deleteActivityCommentReply
  );
  router.put('/unverifiedActivities', isAuthenticated, ActivityController.reviewActivity);

  // ------------- psychologist's requests Controller ------------- //
  router.get('/psychologist', psychCtrl.getPsychologists);
  router.post('/psychologist/request/add/addRequest', optionalAuthentication, psychCtrl.addRequest);
  router.get('/psychologist/request/getRequests', isAuthenticated, psychCtrl.getRequests);
  router.post('/psychologist/request/evalRequest', isAuthenticated, psychCtrl.evaluateRequest);
  // ------------- End Of psychologist's requests Controller ------------- //

  // --------------Product Controller---------------------- //
  router.get('/market/getMarketPage/:entriesPerPage/:' +
    'pageNumber/:limiters', productCtrl.getMarketPage);
  router.get(
    '/market/getNumberOfProducts/:limiters',
    productCtrl.getNumberOfProducts
  );
  router.post('/productrequest/evaluateRequest', isAuthenticated, productCtrl.evaluateRequest);
  router.get('/productrequest/getRequests', isAuthenticated, productCtrl.getRequests);
  router.post('/productrequest/createproduct', isAuthenticated, productCtrl.createProduct);
  router.post('/productrequest/createProductRequest', productCtrl.createProductRequest);

  // --------------End Of Product Contoller ---------------------- //

  // ---------------------- User Controller ---------------------- //
  router.post('/signUp', isNotAuthenticated, userController.signUp);
  router.post('/signIn', isNotAuthenticated, userController.signIn);
  router.post('/childsignup', isAuthenticated, userController.signUpChild);
  router.post('/userData', isAuthenticated, userController.getUserData);
  router.post('/userData/:usernameOrEmail', isAuthenticated, userController.getAnotherUserData);
  router.get('/dupCheck/:usernameOrEmail', userController.isUserExist);
  // ---------------------- End of User Controller --------------- //

  //-------------------- Study Plan Endpoints ------------------//
  router.get('/study-plan/getPublishedStudyPlans/:pageNumber', studyPlanController.getPublishedStudyPlans);
  router.get('/study-plan/getPersonalStudyPlan/:username/:studyPlanID', isAuthenticated, studyPlanController.getPersonalStudyPlan);
  router.get('/study-plan/getPublishedStudyPlan/:studyPlanID', studyPlanController.getPublishedStudyPlan);
  router.patch('/study-plan/createStudyPlan/:username', studyPlanController.createStudyPlan);
  router.patch('/study-plan/rateStudyPlan/:studyPlanID/:rating', studyPlanController.rateStudyPlan);
  router.post('/study-plan/PublishStudyPlan', studyPlanController.PublishStudyPlan);
  //------------------- End of Study Plan Endpoints-----------//

  // -------------- Admin Contoller ---------------------- //

  router.get('/admin/VerifiedContributerRequests/:FilterBy', isAuthenticated, adminController.getVCRs);
  router.patch('/admin/VerifiedContributerRequestRespond/:targetId', isAuthenticated, adminController.VCRResponde);
  router.get(
    '/admin/PendingContentRequests/:type', isAuthenticated,
    adminController.viewPendingContReqs
  );
  router.patch(
    '/admin/RespondContentRequest/:ContentRequestId/:ContentId', isAuthenticated,
    adminController.respondContentRequest
  );
  // --------------End Of Admin Contoller ---------------------- //
  // -------------------- Profile Module Endpoints ------------------//

  router.post('/profile/VerifiedContributerRequest', isAuthenticated, profileController.requestUserValidation);
  router.put('/profile/LinkAnotherParent/:parentId', profileController.linkAnotherParent);
  router.put('/profile/UnLinkChild/:parentId', profileController.unLinkChild);
  router.put('/profile/AddAsAParent/:parentId', profileController.addAsAParent);
  router.get('/profile/:username/getChildren', profileController.getChildren);
  router.patch('/profile/:username/EditChildIndependence', profileController.EditChildIndependence);
  router.patch('/profile/changePassword/:id', profileController.changePassword);
  // ------------------- End of Profile module Endpoints-----------//

  // ---------------Schedule Controller Endpoints ---------------//
  router.patch('/schedule/SaveScheduleChanges/:username', isAuthenticated, scheduleController.updateSchedule);
  router.get('/schedule/getPersonalSchedule/:username', scheduleController.getPersonalSchedule);
  // ------------End of Schedule Controller Endpoints -----------//

  // --------------Content Module Endpoints---------------------- //

  // Content Management

  // Create a category
  router.post('/content/category', isAuthenticated, contentController.createCategory);
  // Create a section

  router.patch(
    '/content/category/:id/section',
    isAuthenticated,
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

  // Get the contents of a user
  router.get(
    '/content/username/:pageSize/:pageNumber',
    isAuthenticated,
    contentController.getContentByCreator
  );

  // Get content by id
  router.get(
    '/content/view/:id',
    contentController.getContentById
  );

  // Get a page of content according to a search query
  router.get(
    '/content/:pageSize/:pageNumber/search',
    contentController.getSearchPage
  );

  // Get Categories
  router.get(
    '/content/category',
    contentController.getCategories
  );

  //Content Production

  router.post(
  // Create new Content
    '/content',
    isAuthenticated,
    contentController.validateContent,
    contentController.validateSelectedCategory,
    contentController.createContent
  );

  // Getting comment details
  router.get(
    '/content/:contentId/comments/:commentId',
    optionalAuthentication,
    contentController.getContentComment
  );
  // Commenting on a content
  router.post(
    '/content/:contentId/comments',
    isAuthenticated,
    contentController.commentOnContent
  );
  // deleting a comment
  router.delete(
    '/content/:contentId/comments/:commentId',
    isAuthenticated,
    contentController.deleteContentComment
  );
  // replying to a content
  router.post(
    '/content/:contentId/comments/:commentId/replies',
    isAuthenticated,
    contentController.postContentCommentReply
  );
  // deleting a reply
  router.delete(
    '/content/:contentId/comments/:commentId/replies/:replyId',
    isAuthenticated,
    contentController.deleteContentCommentReply
  );

  // Edit content
  router.patch(
    '/content',
    isAuthenticated,
    contentController.validateContent,
    contentController.validateSelectedCategory,
    contentController.updateContent
  );
  //-------------------- Messaging Module Endpoints ------------------//

  // Send message
  router.post('/message/sendMessage', messageController.sendMessage);

  //View inbox
  router.get('/message/inbox/:user', messageController.getInbox);

  //View sent
  router.get('/message/sent/:user', messageController.getSent);

  //Delete message
  router.delete('/message/:id', messageController.deleteMessage);

  //------------------- End of Messaging Module Endpoints-----------//


  // -------------------------------------------------------------------- //
  module.exports = router;

  return router;
};

