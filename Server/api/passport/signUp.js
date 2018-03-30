/* eslint-disable */

// ---------------------- Requirements ---------------------- //
var mongoose = require('mongoose');
var Encryption = require('../utils/encryption/encryption');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');
// ---------------------- End of Requirements ---------------------- //


// ---------------------- Variables ---------------------- //
var newUser = new User();
// ---------------------- End of Variables ---------------------- //


// ---------------------- Validators ---------------------- //
var isArray = require('../utils/validators/is-array');
var isBoolean = require('../utils/validators/is-boolean');
var isDate = require('../utils/validators/is-date');
var isInteger = require('../utils/validators/is-integer');
var isString = require('../utils/validators/is-string');
var isNotEmpty = require('../utils/validators/not-empty');
// ---------------------- End of Validators ---------------------- //


// ---------------------- Passport ---------------------- //
module.exports = function (passport) {
    passport.use('local-signup', new LocalStrategy(
        { passReqToCallback: true },
        function (req, username, password, done) {
            var findOrCreateUser = function () {

                // --- Variable Assign --- //
                newUser.address = req.body.address;
                newUser.birthdate = req.body.birthdate;
                newUser.children = req.body.children;
                newUser.email = req.body.email;
                newUser.isChild = req.body.isChild;
                newUser.isParent = req.body.isParent;
                newUser.isTeacher = req.body.isTeacher;
                newUser.password = req.body.password;
                newUser.phone = req.body.phone;
                newUser.username = req.body.username;
                // --- End of Variable Assign --- //

                // --- Type Check --- //
                try {
                    isString.isString(newUser.address);
                    isDate.isDate(newUser.birthdate);
                    isArray.isArray(newUser.children);
                    isString.isString(newUser.email);
                    isBoolean.isBoolean(newUser.isChild);
                    isBoolean.isBoolean(newUser.isParent);
                    isBoolean.isBoolean(newUser.isTeacher);
                    isString.isString(newUser.password);
                    isArray.isArray(newUser.phone);
                    isString.isString(newUser.username);
                } catch (err) {
                    return done(null, false, { 'signUpMessage': err.message });
                }
                // --- End of Type Check --- //


                // --- Not Empty Check --- //
                try {
                    isNotEmpty.isNotEmpty(newUser.birthdate);
                    isNotEmpty.isNotEmpty(newUser.email);
                    isNotEmpty.isNotEmpty(newUser.isChild);
                    isNotEmpty.isNotEmpty(newUser.isParent);
                    isNotEmpty.isNotEmpty(newUser.isTeacher);
                    isNotEmpty.isNotEmpty(newUser.password);
                    isNotEmpty.isNotEmpty(newUser.username);
                } catch (err) {
                    return done(null, false, { 'signUpMessage': err.message });
                }
                // --- End of Not Empty Check --- //

                // --- Check birthdate With isChild --- //
                if (!isChild && ((new Date().getFullYear() - birthdate.getFullYear()) < 13)) {
                    return done(null, false, { 'signUpMessage': 'Under 13 Must Be Child!' });
                }
                // --- End of Check birthdate With isChild --- //


                // --- Trimming & Lowering Cases--- //
                newUser.address = newUser.address.toLowerCase();
                newUser.email = newUser.email.toLowerCase().trim();
                newUser.username = newUser.username.toLowerCase().trim();
                // --- End of Trimming & Lowering Cases--- //  

                









                User.findOne({ 'username': newUser.username }, function (err, user) {
                    if (err) {
                        return done(err);
                    } else if (user) {
                        return done(null, false, { 'signUpMessage': 'Username Exists!' });
                    }
                });

                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    }

                    return done(null, newUser);
                });
            };

            process.nextTick(findOrCreateUser);
        }
    ));
};
// ---------------------- End of Passport ---------------------- //
