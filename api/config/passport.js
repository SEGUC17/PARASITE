// -------------------------- Requirements ------------------------------- //
var config = require('../config/config');
var secret = require('../utils/secret');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var FacebookTokenStrategy = require('passport-facebook-token');
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
            clientID: secret.FACEBOOK.ID,
            clientSecret: secret.FACEBOOK.PW
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOrCreate({ facebookId: profile.id }, function (error, user) {
                return done(error, user);
            });
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
