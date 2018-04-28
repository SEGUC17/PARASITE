
/* eslint-disable max-len */
/* eslint-disable max-statements */


var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Report = require('../models/Report');
var UserRating = require('../models/UserRating');

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
var UserRatingController = require('../controllers/UserRatingController');
var tagController = require('../controllers/TagController');

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
  router.post(
    '/activities/:activityId/book',
    isAuthenticated,
    ActivityController.isIndependent,
    ActivityController.bookActivity
  );
  router.delete(
    '/activities/:activityId/comments/:commentId',
    isAuthenticated,
    ActivityController.prepareActivity,
    DiscussionController.deleteComment
  );
  router.delete(
    '/activities/:activityId/comments/:commentId/replies/:replyId',
    isAuthenticated,
    ActivityController.prepareActivity,
    DiscussionController.deleteCommentReply
  );
  router.put('/unverifiedActivities', isAuthenticated, ActivityController.reviewActivity);
  router.patch('/activities/:activityId/EditActivity', isAuthenticated, ActivityController.editActivity);
  // ------------- psychologist's requests Controller ------------- //
  router.get('/psychologist/search/:limiters', psychCtrl.getPsychologists);
  router.get('/psychologist/:id', psychCtrl.getPsychologistData);
  router.delete('/psychologist/delete/:id', optionalAuthentication, psychCtrl.deletePsychologist);
  router.post('/psychologist/request/edit', optionalAuthentication, psychCtrl.editRequest);
  router.post('/psychologist/request/add/addRequest', optionalAuthentication, psychCtrl.addRequest);
  router.get('/psychologist/request/getRequests', isAuthenticated, psychCtrl.getRequests);
  router.post('/psychologist/request/evalRequest', isAuthenticated, psychCtrl.evaluateRequest);
  // ------------- End Of psychologist's requests Controller ------------- //

  // --------------Product Controller---------------------- //
  router.get('/market/getMarketPage/:entriesPerPage/:' +
    'pageNumber/:limiters', isAuthenticated, productCtrl.getMarketPage);

  router.post('/productrequest/evaluateRequest', isAuthenticated, productCtrl.evaluateRequest);
  router.get('/productrequest/getRequests', isAuthenticated, productCtrl.getRequests);
  router.post('/productrequest/createproduct', isAuthenticated, productCtrl.createProduct);
  router.post('/productrequest/createProductRequest', productCtrl.createProductRequest);
  router.get('/productrequest/getUserRequests/:username', isAuthenticated, productCtrl.getUserRequests);
  router.patch('/productrequest/getUserRequests/:id', isAuthenticated, productCtrl.updateRequest);
  router.patch('/productrequest/editPrice/:id/:username', isAuthenticated, productCtrl.editPrice);

  router.patch('/productrequest/updateProdRequest/:id/:username', isAuthenticated, productCtrl.updateRequest);

  // --------------End Of Product Contoller ---------------------- //

  // ---------------------- User Controller ---------------------- //
  router.post('/signUp', isNotAuthenticated, userController.signUp);
  router.get('/verifyEmail/:id', isNotAuthenticated, userController.verifyEmail);
  router.post('/signIn', isNotAuthenticated, userController.signIn);
  router.get('/isSignedIn', isNotAuthenticated, isAuthenticated);
  router.post('/childsignup', isAuthenticated, userController.signUpChild);
  router.post('/userData', isAuthenticated, userController.getUserData);
  router.post('/userData/:usernameOrEmail', isAuthenticated, userController.getAnotherUserData);
  router.get('/dupCheck/:usernameOrEmail', userController.isUserExist);
  router.get('/forgotPassword/:email', userController.forgotPassword);
  router.patch('/forgotPassword/resetpassword/:id', userController.resetPassword);
  // ---------------------- End of User Controller --------------- //

  //-------------------- Study Plan Endpoints ------------------//
  router.get('/study-plan/getPublishedStudyPlans/:pageNumber', studyPlanController.getPublishedStudyPlans);
  router.get('/study-plan/getPersonalStudyPlan/:username/:studyPlanID', isAuthenticated, studyPlanController.getPersonalStudyPlan);
  router.get('/study-plan/getPublishedStudyPlan/:studyPlanID', studyPlanController.getPublishedStudyPlan);
  router.patch('/study-plan/createStudyPlan', isAuthenticated, studyPlanController.createStudyPlan);
  router.patch('/study-plan/rateStudyPlan/:studyPlanID/:rating', studyPlanController.rateStudyPlan);
  router.post('/study-plan/PublishStudyPlan', isAuthenticated, studyPlanController.publishStudyPlan);
  router.delete('/study-plan/deleteStudyPlan/:studyPlanID', isAuthenticated, studyPlanController.deleteStudyPlan);
  router.delete('/study-plan/deleteStudyPlan/:studyPlanID', isAuthenticated, studyPlanController.deletePublishedStudyPlan);
  router.patch('/study-plan/assignStudyPlan/:username/:studyPlanID', isAuthenticated, studyPlanController.assignStudyPlan);
  router.patch('/study-plan/unAssignStudyPlan/:username/:studyPlanID', isAuthenticated, studyPlanController.unAssignStudyPlan);
  router.patch('/study-plan/editPersonalStudyPlan/:username/:studyPlanID', isAuthenticated, studyPlanController.editPersonalStudyPlan);
  //------------------- End of Study Plan Endpoints-----------//

  // -------------- Admin Contoller ---------------------- //
  router.get('/admin/VerifiedContributerRequests/:FilterBy', isAuthenticated, adminController.getVCRs);
  router.patch('/admin/VerifiedContributerRequestRespond/:targetId', isAuthenticated, adminController.VCRResponde);
  router.get('/admin/removePublishedStudyPlan/:studyPlanID', isAuthenticated, adminController.removePublishedStudyPlans);
  router.get(
    '/admin/PendingStudyPlanPublishRequests', isAuthenticated,
    adminController.viewStudyPlanPublishReqs
  );
  router.patch(
    '/admin/RespondStudyPlanPublishRequest/:studyPlanPublishRequestId/:studyPlanId', isAuthenticated,
    adminController.respondStudyPlanPublishRequest
  );
  router.get(
    '/admin/PendingContentRequests/:res/:idea/:create/:edit', isAuthenticated,
    adminController.viewPendingContReqs
  );
  router.patch(
    '/admin/RespondContentRequest/:ContentRequestId/:ContentId', isAuthenticated,
    adminController.respondContentRequest
  );
  router.get('/admin/getReports', isAuthenticated, adminController.getReports);

  // --------------End Of Admin Contoller ---------------------- //
  // -------------------- Profile Module Endpoints ------------------//

  router.post('/profile/VerifiedContributerRequest', isAuthenticated, profileController.requestUserValidation);
  router.put('/profile/LinkAnotherParent/:parentId', profileController.linkAnotherParent);
  router.put('/profile/UnLinkChild/:parentId', profileController.unLinkChild);
  router.put('/profile/AddAsAParent/:parentId', profileController.addAsAParent);
  router.get('/profile/:username/getChildren', profileController.getChildren);
  router.patch('/profile/:username/EditChildIndependence', profileController.EditChildIndependence);
  router.patch('/profile/changePassword/:id', profileController.changePassword);
  router.patch('/profile/:username/UnlinkMyself', isAuthenticated, profileController.UnlinkIndependent);
  router.patch('/profile/changeChildInfo', profileController.changeChildInfo);
  router.patch('/profile/ChangeInfo/:id', profileController.ChangeInfo);
  router.post('/profile/ReportUser', isAuthenticated, profileController.reportUser);


  // ------------------- End of Profile module Endpoints-----------//

  // ---------------Schedule Controller Endpoints ---------------//
  router.patch('/schedule/SaveScheduleChanges/:username', isAuthenticated, scheduleController.updateSchedule);
  router.put('/schedule/addEvent/:username', isAuthenticated, scheduleController.addEvent);
  router.get('/schedule/getPersonalSchedule/:username', isAuthenticated, scheduleController.getPersonalSchedule);
  // ------------End of Schedule Controller Endpoints -----------//

  // --------------Content Module Endpoints---------------------- //

  // Content Management

  // Create a category
  router.post(
    '/content/category',
    isAuthenticated,
    contentController.checkAdmin,
    contentController.validateIconLink,
    contentController.createCategory
  );

  // Create a section
  router.post(
    '/content/category/:id/section',
    isAuthenticated,
    contentController.checkAdmin,
    contentController.validateIconLink,
    contentController.createSection
  );

  // Update a category
  router.patch(
    '/content/category/:categoryId',
    isAuthenticated,
    contentController.checkAdmin,
    contentController.validateIconLink,
    contentController.updateCategory
  );

  // Update a section
  router.patch(
    '/content/category/:categoryId/section/:sectionId',
    isAuthenticated,
    contentController.checkAdmin,
    contentController.validateIconLink,
    contentController.updateSection
  );

  // delete a category
  router.delete(
    '/content/category/:id',
    isAuthenticated,
    contentController.deleteCategory
  );

  // delete a section
  router.delete(
    '/content/category/:categoryId/section/:sectionId',
    isAuthenticated,
    contentController.deleteSection
  );

  //Category retrieval
  router.get(
    '/content/category',
    contentController.getCategories
  );


  // Content Retrieval

  // Get the contents of a user
  router.get(
    '/content/username/:pageSize/:pageNumber/categorization',
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
    contentController.validateSelectedSection,
    contentController.createContent
  );

  // Getting comment details
  router.get(
    '/content/:contentId/comments/:commentId',
    optionalAuthentication,
    contentController.prepareContent,
    DiscussionController.getComment
  );
  // Commenting on a content
  router.post(
    '/content/:contentId/comments',
    isAuthenticated,
    contentController.prepareContent,
    DiscussionController.postComment
  );
  // deleting a comment
  router.delete(
    '/content/:contentId/comments/:commentId',
    isAuthenticated,
    contentController.prepareContent,
    DiscussionController.deleteComment
  );
  // replying to a content
  router.post(
    '/content/:contentId/comments/:commentId/replies',
    isAuthenticated,
    contentController.prepareContent,
    DiscussionController.postCommentReply
  );
  // deleting a reply
  router.delete(
    '/content/:contentId/comments/:commentId/replies/:replyId',
    isAuthenticated,
    contentController.prepareContent,
    DiscussionController.deleteCommentReply
  );

  // Edit content
  router.patch(
    '/content',
    isAuthenticated,
    contentController.validateContent,
    contentController.validateSelectedCategory,
    contentController.validateSelectedSection,
    contentController.updateContent
  );

  // delete content
  router.delete(
    '/content/:id',
    isAuthenticated,
    contentController.deleteContent
  );

  // Add gamification score
  router.post(
    '/content/:contentId/score',
    isAuthenticated,
    contentController.addScore
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

  //Blocking users from messaging
  router.patch('/message/block/:blocked', messageController.block);

  //Get recently contacted users
  router.get('/message/contacts/:user', messageController.getRecentlyContacted);

  // Registered user contacts admins
  router.post('/contactus', messageController.contactAdmin);
    //Unblocking users
    router.patch('/message/unblock/:blocked', messageController.unBlock);
  //------------------- End of Messaging Module Endpoints-----------//

  //-------------------- Rating Endpoints ------------------//
  router.put('/rating', isAuthenticated, UserRatingController.postRating);
  //------------------- End of Rating Endpoints-----------//

  //-------------------- Tag Endpoints ------------------//
  router.get('/tags/getTags', tagController.getTags);
  router.get('/tags/getSubtags/:id', tagController.getSubtags);
  router.delete('/tags/deleteTag/:id', isAuthenticated, tagController.deleteTag);
  router.delete('/tags/deleteSubtag/:id', isAuthenticated, tagController.deleteSubtag);
  router.post('/tags/addTag', isAuthenticated, tagController.addTag);
  router.post('/tags/addSubtag/:id', isAuthenticated, tagController.addSubtag);
  //------------------- End of Tag Endpoints-----------//

  // -------------------------------------------------------------------- //
  module.exports = router;

  return router;
};
