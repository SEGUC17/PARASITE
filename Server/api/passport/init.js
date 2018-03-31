/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint-disable max-len */

// ---------------------- Requirements ---------------------- //
var mongoose = require('mongoose');
var signUp = require('./signUp');
var signIn = require('./signIn');
var User = mongoose.model('User');
// ---------------------- End of Requirements ---------------------- //


// ---------------------- Passport ---------------------- //
module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    signUp(passport);
    //signIn(passport);
};
// ---------------------- End of Passport ---------------------- //
