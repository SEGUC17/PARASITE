var mongoose = require('mongoose')
    config = require('./config');
    
    mongoose.connect(config.MONGO_URI).
    then(function () {
        console.log('successfully connected to database on the url: ' +
        config.MONGO_URI);
    }).
    catch(function (err) {
        if (err) {
            console.error(err);
        }
        
    });
    
    //TODO: add models
require('../models/Activity');