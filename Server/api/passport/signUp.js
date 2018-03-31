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
    passport.use('local-signup', new LocalStrategy(
        { passReqToCallback: true },
        function (req, username, password, done) {
            var findOrCreateUser = function () {
                // --- Security Check --- //
                req.user = null;
                req.res = { 'code': 0, 'msg': '' };
                // --- End of "Security Check" --- //


                // --- Variable Assign --- //
                newUser.address = req.body.address;
                newUser.birthdate = req.body.birthdate;
                newUser.children = req.body.children;
                newUser.email = req.body.email;
                newUser.firstName = req.body.firstName;
                newUser.isChild = req.body.isChild;
                newUser.isParent = req.body.isParent;
                newUser.isTeacher = req.body.isTeacher;
                newUser.lastName = req.body.lastName;
                newUser.password = req.body.password;
                newUser.phone = req.body.phone;
                newUser.username = req.body.username;
                // --- End of "Variable Assign" --- //


                // --- Check: Type --- //
                try {
                    isString((newUser.address) ? newUser.address : '');
                    isDate((newUser.birthdate) ? newUser.birthdate : new Date());
                    isArray((newUser.children) ? newUser.children : []);
                    isString((newUser.email) ? newUser.email : '');
                    isString((newUser.firstName) ? newUser.firstName : '');
                    isBoolean((newUser.isChild) ? newUser.isChild : false);
                    isBoolean((newUser.isParent) ? newUser.isParent : false);
                    isBoolean((newUser.isTeacher) ? newUser.isTeacher : false);
                    isString((newUser.lastName) ? newUser.lastName : '');
                    isString((newUser.password) ? newUser.password : '');
                    isArray((newUser.phone) ? newUser.phone : []);
                    isString((newUser.username) ? newUser.username : '');
                } catch (err) {
                    req.res.code = 400;
                    req.res.msg = err.message;
                    return done(null, false, { 'signUpMessage': err.message });
                }
                // --- End of "Check: Type" --- //


                // --- Check: Not Empty --- //
                try {
                    isNotEmpty(newUser.birthdate);
                    isNotEmpty(newUser.email);
                    isNotEmpty(newUser.firstName);
                    isNotEmpty(newUser.isChild);
                    isNotEmpty(newUser.isParent);
                    isNotEmpty(newUser.isTeacher);
                    isNotEmpty(newUser.lastName);
                    isNotEmpty(newUser.password);
                    isNotEmpty(newUser.username);
                } catch (err) {
                    req.res.code = 400;
                    req.res.msg = err.message;
                    return done(null, false, { 'signUpMessage': err.message });
                }
                // --- End of "Check: Not Empty" --- //


                // --- Check: birthdate With isChild --- //
                if (!newUser.isChild && ((new Date().getFullYear() - newUser.birthdate.getFullYear()) < 13)) {
                    req.res.code = 400;
                    req.res.msg = 'Under 13 Must Be Child!';
                    return done(null, false, { 'signUpMessage': 'Under 13 Must Be Child!' });
                }
                // --- End of "Check: birthdate With isChild" --- //


                // --- Check: Email Regex Match --- //
                if (!newUser.email.match(/\S+@\S+\.\S+/)) {
                    req.res.code = 400;
                    req.res.msg = 'Email Is Not Valid!';
                    return done(null, false, { 'signUpMessage': 'Email Is Not Valid!' });
                }
                // --- End of "Check: Email Regex Match" --- //


                // --- Check: Password Length --- //
                if (newUser.password.length < 8) {
                    req.res.code = 400;
                    req.res.msg = 'Password Length Must Be Greater Than 8!';
                    return done(null, false, { 'signUpMessage': 'Password Length Must Be Greater Than 8!' });
                }
                // --- End of "Check: Password Length" --- //


                // --- Check: Phone Regex Match ---//
                for (i = 0; i < newUser.phone.length; i++) {
                    if (!newUser.phone[i].match(/^\d+$/)) {
                        req.res.code = 400;
                        req.res.msg = 'Phone Is Not Valid!';
                        return done(null, false, { 'signUpMessage': 'Phone Is Not Valid!' });
                    }
                }
                // --- End of "Check: Phone Regex Match" ---//


                // --- Trimming & Lowering Cases--- //
                newUser.address = (newUser.address) ? newUser.address.toLowerCase() : newUser.address;
                newUser.email = (newUser.email) ? newUser.email.toLowerCase().trim() : newUser.email;
                newUser.username = (newUser.username) ? newUser.username.toLowerCase().trim() : newUser.username;
                // --- End of "Trimming & Lowering Cases"--- //


                // --- Check: Duplicate Username --- //
                User.findOne({ 'username': newUser.username }, function (err, user) {
                    if (err) {
                        return done(err);
                    } else if (user) {
                        req.res.code = 400;
                        req.res.msg = 'Username Exists!';
                        return done(null, false, { 'signUpMessage': 'Username Exists!' });
                    }
                });
                // --- End of "Check: Duplicate Username" --- //


                // --- Add User --- //
                Encryption.hashPassword(newUser.password, function (err, hash) {
                    if (err) {
                        return done(err);
                    }

                    newUser.password = hash;
                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        req.res.code = 201;
                        req.res.msg = 'Sign Up Successfully!';
                        return done(null, newUser);
                    });
                });
                // --- End of "Add User" --- //


            };


            // --- Executing findOrCreateUser --- //
            process.nextTick(findOrCreateUser);
            // --- End of "Executing findOrCreateUser" --- //


        }
    ));
};
// ---------------------- End of "Passport" ---------------------- //
