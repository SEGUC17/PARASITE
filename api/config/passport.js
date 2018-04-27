// -------------------------- Requirements ------------------------------- //
var config = require('../config/config');
var SECRET = require('../utils/secret');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var generateString = require('../utils/generators/generate-string');
var JWTStrategy = require('passport-jwt').Strategy;
var User = require('../models/User');
// -------------------------- End of "Requirements" ---------------------- //

module.exports = function (passport) {
    passport.use(new JWTStrategy(
        {
            'jwtFromRequest': ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            'secretOrKey': config.SECRET
        },
        function (jwtPayload, done) {
            User.findById(jwtPayload.id, function (err, user) {
                return done(err, user);
            });
        }
    ));

    passport.use(new FacebookTokenStrategy(
        {
            accessTokenField: 'accessToken',
            clientID: SECRET.FACEBOOK.ID,
            clientSecret: SECRET.FACEBOOK.PW,
            profileFields: [
                'emails',
                'id',
                'age_range',
                'first_name',
                'gender',
                'last_name',
                'picture',
                'verified'
            ],
            refreshTokenField: 'refreshToken'
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOneAndUpdate(
                {
                    $or: [
                        { 'email': profile.emails[0].value },
                        { 'facebookId': profile.id }
                    ]
                },
                {
                    'email': profile.emails[0].value,
                    'facebookId': profile.id,
                    'isEmailVerified': true
                },
                function (err, user) {
                    if (err) {
                        return done(err);
                    } else if (user) {
                        return done(null, user);
                    }

                    var newUser = new User({
                        email: profile.emails[0].value,
                        facebookId: profile.id,
                        firstName: profile.name.givenName,
                        isEmailVerified: true,
                        lastName: profile.name.familyName,
                        password: generateString(12),
                        username: profile.emails[0].value
                    });

                    console.log(newUser);

                    newUser.save(function (err2, user2) {
                        if (err2) {
                            return done(err2);
                        }

                        return done(null, user2);
                    });
                }
            );
        }
    ));

    passport.use(new GoogleStrategy(
        {
            accessTokenField: 'accessToken',
            callbackURL: config.BACKENDEND_URI + 'auth/google/callback',
            clientID: SECRET.GOOGLE.ID,
            clientSecret: SECRET.GOOGLE.PW,
            refreshTokenField: 'refreshToken'
        },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile);
        }
    ));
};

module.exports.getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        }

        return null;
    }

    return null;
};
