// -------------------------- Requirements ------------------------------- //
var config = require('../config/config');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JWTStrategy = require('passport-jwt').Strategy;
var User = require('../models/User');
// -------------------------- End of "Requirements" ---------------------- //

module.exports = function (passport) {
    passport.use(new JWTStrategy(
        {
            'jsonWebTokenOptions': { maxAge: 24 * 60 * 60 * 1000 },
            'jwtFromRequest': ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            'secretOrKey': config.SECRET
        },
        function (jwtPayload, done) {
            User.findOne(
                { '_id': jwtPayload },
                function (err, user) {
                    if (err) {
                        return done(false, null);
                    } else if (!user) {
                        return done(null, false);
                    }

                    return done(null, user);
                }
            );
        }));
};