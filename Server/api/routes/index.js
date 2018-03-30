/* eslint-disable max-len */

var express = require('express');
var router = express.Router();

var profileController = require('../controllers/ProfileController');
var contentController = require('../controllers/ContentController');
var studyPlanController = require('../controllers/StudyPlanController');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
};

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Server Works');
});


// ---------------------- User Controller ---------------------- //
module.exports = function (passport) {
  router.post('/signup', passport.authenticate('local-signup'));
  router.post('/signin', passport.authenticate('local-signin'));
};
// ---------------------- End of User Controller --------------- //


//-------------------- Profile Module Endpoints ------------------//
router.post('/profile/VerifiedContributerRequest', profileController.requestUserValidation);
router.get('/profile/:username', profileController.getUserInfo);
//------------------- End of Profile module Endpoints-----------//

//-------------------- Study Plan Endpoints ------------------//
router.get('/study-plan/getPerosnalStudyPlans/:username', studyPlanController.getPerosnalStudyPlans);
router.get('/study-plan/getPerosnalStudyPlan/:username/:studyPlanID', studyPlanController.getPerosnalStudyPlan);
router.get('/study-plan/getPublishedStudyPlan/:studyPlanID', studyPlanController.getPublishedStudyPlan);
router.patch('/study-plan/getPublishedStudyPlan/:username', studyPlanController.createStudyPlan);
//------------------- End of Study Plan Endpoints-----------//


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
