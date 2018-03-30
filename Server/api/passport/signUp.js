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
var isDateInFuture = require('../utils/validators/is-date-in-future');
var isEmpty = require('../utils/validators/is-empty');
var isInteger = require('../utils/validators/is-integer');
var isString = require('../utils/validators/is-string');
// ---------------------- End of Validators ---------------------- //


// ---------------------- Passport ---------------------- //
module.exports = function (passport) {
    passport.use('local-signup', new LocalStrategy(
        { passReqToCallback: true },
        function (req, username, password, done) {
            var findOrCreateUser = function () {

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















                User.findOne({ 'username': newUser.username }, function (err, user) {
                    if (err) {
                        return done(err);
                    } else if (user) {
                        return done(null, false, {"signUpMessage": "Username Exists!"});
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
// ---------------------- End of Passport ---------------------- //
