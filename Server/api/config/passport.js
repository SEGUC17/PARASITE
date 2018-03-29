var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User');
var newUser = new User();

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    passport.use('local-signup', new LocalStrategy(
        {
            passReqToCallback: true,
            passwordField: 'password',
            usernameField: 'username'
        },
        function (req, username, password, done) {
            process.nextTick(function () {
                User.findOne(username, function (err, user) {
                    if (err) {
                        return done(err);
                    } else if (user) {
                        return done(
                            null,
                            false,
                            req.flash(
                                'signupMessage',
                                'Username is already in use!'
                            )
                        );
                    }
                    newUser.username = username;
                    newUser.password = password;
                    newUser.save(function (err2) {
                        if (err2) {
                            throw err2;
                        }

                        return done(null, newUser);
                    });
                });
            });
        }
    ));
    passport.use('local-signin', new LocalStrategy(
        {
            passReqToCallback: true,
            passwordField: 'password',
            usernameField: 'username'
        },
        function (req, username, password, done) {
            User.findOne(username, function (err, user) {
                if (err) {
                    return done(err);
                } else if (!user || !user.validPassword(password)) {
                    return done(
                        null,
                        false,
                        req.flash(
                            'loginMessage',
                            'Wrong username or password!'
                        )
                    );
                }

                return done(null, user);
            });
        }
    ));
};
