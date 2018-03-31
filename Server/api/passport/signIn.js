/* eslint-disable */

// ---------------------- Requirements ---------------------- //
var mongoose = require('mongoose');
var Encryption = require('../utils/encryption/encryption');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');
// ---------------------- End of "Requirements" ---------------------- //


// ---------------------- Variables ---------------------- //
var newUser = new User();
// ---------------------- End of "Variables" ---------------------- //


// ---------------------- Validators ---------------------- //
var isArray = require('../utils/validators/is-array');
var isBoolean = require('../utils/validators/is-boolean');
var isDate = require('../utils/validators/is-date');
var isInteger = require('../utils/validators/is-integer');
var isString = require('../utils/validators/is-string');
var isNotEmpty = require('../utils/validators/not-empty');
// ---------------------- End of "Validators" ---------------------- //


// ---------------------- Passport ---------------------- //
module.exports = function (passport) {
    passport.use('local-signin', new LocalStrategy(
        { passReqToCallback: true },
        function (req, username, password, done) {
            var signInIfExist = function () {
                // --- Username Verfication --- //
                User.findOne({ 'username': username },
                    function (err, user) {
                        if (err) {
                            return done(err);
                        } else if (!user) {
                            return done(null, false, { 'signInMessage': 'Wrong Username Or Password!' });
                        }

                        // --- Password Verification --- //
                        Encryption.comparePasswordToHash(password, user.password, function (
                            err,
                            passwordMatches
                        ) {
                            if (err) {
                                return next(err);
                            } else if (!passwordMatches) {
                                return done(null, false, { 'signInMessage': 'Wrong Username Or Password!' });
                            }

                            return done(null, user);
                        });
                        // --- End of "Password Verification" --- //
                    });
                // --- End of "Username Verfication" --- //
            };


            // --- Executing signInIfExist --- //
            process.nextTick(signInIfExist);
            // --- End of "Executing signInIfExist" --- //
        }));
};
// ---------------------- End of "Passport" ---------------------- //
