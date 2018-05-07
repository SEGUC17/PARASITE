var mongoose = require('mongoose');
var config = require('./config');
var ClassifierController = require('../controllers/ClassifierController');

mongoose.connect(config.MONGO_URI).
    then(function () {
        console.log('successfully connected to database on the url: ' +
            config.MONGO_URI);
        ClassifierController.loadDictionary();
    }).
    catch(function (err) {
        if (err) {
            console.error(err);
        }
    });

//TODO: add models
require('../models/Product');
require('../models/ProductRequest');
require('../models/Comment');
require('../models/Activity');
require('../models/Content');
require('../models/User');
require('../models/PsychologistRequest');
require('../models/Psychologist');
require('../models/Category');
require('../models/VerifiedContributerRequest');
require('../models/ContentRequest');
require('../models/StudyPlan');
require('../models/StudyPlanPublishRequest');
require('../models/Message');
require('../models/Tag');
require('../models/Newsfeed');
require('../models/Word');
