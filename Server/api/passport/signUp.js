/* eslint-disable */

// ---------------------- Requirements ---------------------- //
var mongoose = require('mongoose');
var Encryption = require('../utils/encryption/encryption');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');
var newUser = new User();
// ---------------------- End of Requirements ---------------------- //

module.exports = function (passport) {
    passport.use('local-signup', new LocalStrategy(
        { passReqToCallback: true },
        function (req, username, password, done) {
            var findOrCreateUser = function () {

                newUser.address = req.body.address;
                newUser.birthdate = req.body.birthdate;
                newUser.children = [];
                newUser.email = req.body.email;
                newUser.isAdmin = false;
                newUser.isChild = req.body.isChild;
                newUser.isParent = req.body.isParent;
                newUser.isTeacher = req.body.isTeacher;
                newUser.password = req.body.password;
                newUser.phone = req.body.phone;
                newUser.username = req.body.username;
                newUser.verified = req.body.verified;

                User.findOne({ 'username': username.trim().toLowerCase() }, function (err, user) {
                    if (err) {
                        return done(err);
                    } else if (user) {
                        return done(null, false);
                    }
                });

                newUser.save(function (err2) {
                    if (err2) {
                        throw err2;
                    }

                    return done(null, newUser);
                });
            };
            process.nextTick(findOrCreateUser);
        }
    ));
};
