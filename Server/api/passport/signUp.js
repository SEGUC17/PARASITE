/* eslint-disable max-len */
/* eslint-disable max-statements */

// ---------------------- Requirements ---------------------- //
var mongoose = require('mongoose');
var Encryption = require('../utils/encryption');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');
var newUser = new User();
// ---------------------- End of Requirements ---------------------- //

module.exports = function (passport) {
    passport.use('local-signup', new LocalStrategy(
        { passReqToCallback: true },
        function (req, res, done) {
            var findOrCreateUser = function () {
                User.findOne(
                    { username: req.body.username.trim().toLowerCase() },
                    function (err, user) {
                        if (err) {
                            return done(err);
                        } else if (user) {
                            return res.status(422).json({
                                data: null,
                                err: null,
                                msg: 'Username is used!'
                            });
                        }

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

                        newUser.save(function (err2) {
                            if (err2) {
                                throw err;
                            }

                            return res.status(201).json({
                                data: newUser,
                                err: null,
                                msg: 'Sign Up is a success!'
                            });
                        });
                    }
                );
            };
            process.nextTick(findOrCreateUser);
        }
    ));
};
