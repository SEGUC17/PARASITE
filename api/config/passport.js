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
            User.findOne(
                {
                    $or: [
                        { 'email': profile.emails[0].value },
                        { 'facebookId': profile.id }
                    ]
                },
                function (err, user) {
                    return done(err, user, { 'profile': profile });
                }
            );
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
