/* eslint-disable max-len */
/* eslint-disable max-statements */

// ---------------------- Requirements ---------------------- //
var mongoose = require('mongoose');
var Encryption = require('../utils/encryption/encryption');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

var newUser = new User();
// ---------------------- End of "Requirements" ---------------------- //


// ---------------------- Validators ---------------------- //
var isArray = require('../utils/validators/is-array');
var isBoolean = require('../utils/validators/is-boolean');
var isDate = require('../utils/validators/is-date');
var isInteger = require('../utils/validators/is-integer');
var isString = require('../utils/validators/is-string');
var isNotEmpty = require('../utils/validators/not-empty');
// ---------------------- End of "Validators" ---------------------- //


module.exports.signUp = function (passport, req, res, next) {
    passport.authenticate('local-signup', function (err, user, info) {
        if (err) {
            return next(err);
        } else if (!user) {
            return res.status(400).json({
                data: null,
                err: null,
                msg: info.signUpMessage
            });
        }

        req.logIn(user, function (err2) {
            if (err2) {
                return next(err2);
            }

            return res.status(201).json({
                data: user,
                err: null,
                msg: 'Sign Up Successfully!'
            });
        });
    })(req, res, next);
};

module.exports.signIn = function (passport, req, res, next) {
    passport.authenticate('local-signin', function (err, user, info) {
        if (err) {
            return next(err);
        } else if (!user) {
            return res.status(401).json({
                data: null,
                err: null,
                msg: info.signInMessage
            });
        }

        req.logIn(user, function (err2) {
            if (err2) {
                return next(err2);
            }

            return res.status(200).json({
                data: user,
                err: null,
                msg: 'Sign In Successfully!'
            });
        });
    })(req, res, next);
};


module.exports.signUpChild = function (req, res, next) {
    // to make the user a parent
    console.log('entered the signUpChild method');
    console.log('user is: ' + req.user._id);
    User.findByIdAndUpdate(req.user._id, { $set: { 'children': req.body.username, 'isParent': true } }
        , { new: true }, function (err, updatedob) {
            if (err) {
                console.log('entered the error stage of update');
                return res.status(402).json({
                    data: null,
                    msg: 'error occurred during updating parents attributes , parent is:' + req.user._id.isParent
                });
            }
            // --- Variable Assign --- //
            console.log('about to set attributes od child');
            newUser.address = req.body.address;
            newUser.birthdate = req.body.birthdate;
            newUser.children = [];
            newUser.email = req.body.email;
            newUser.firstName = req.body.firstName;
            newUser.isChild = true;
            newUser.isParent = false;
            newUser.isTeacher = false;
            newUser.lastName = req.body.lastName;
            newUser.password = req.body.password;
            newUser.phone = req.body.phone;
            newUser.username = req.body.username;
            // --- End of "Variable Assign" --- //
            console.log('updated attributes of child set');
            try {
                isString(newUser.address ? newUser.address : '');
                isDate(newUser.birthdate ? newUser.birthdate : new Date());
                isArray(newUser.children ? newUser.children : []);
                isString(newUser.email ? newUser.email : '');
                isString(newUser.firstName ? newUser.firstName : '');
                isBoolean(newUser.isChild ? newUser.isChild : false);
                isBoolean(newUser.isParent ? newUser.isParent : false);
                isBoolean(newUser.isTeacher ? newUser.isTeacher : false);
                isString(newUser.lastName ? newUser.lastName : '');
                isString(newUser.password ? newUser.password : '');
                isArray(newUser.phone ? newUser.phone : []);
                isString(newUser.username ? newUser.username : '');

            } catch (errr) {
                console.log('entered catch of status 401');

                return res.status(401).json({
                    data: null,
                    errr: null,
                    msg: 'your message does not match the required data entries!' + errr.message
                });
            }
            //end catch

            try {
                console.log('entered try of is empty');
                isNotEmpty(newUser.birthdate);
                isNotEmpty(newUser.email);
                isNotEmpty(newUser.firstName);
                isNotEmpty(newUser.isChild);
                isNotEmpty(newUser.isParent);
                isNotEmpty(newUser.isTeacher);
                isNotEmpty(newUser.lastName);
                isNotEmpty(newUser.password);
                isNotEmpty(newUser.username);
            } catch (errrr) {
                console.log('entered catch of 2nd status 401');

                return res.status(401).json({
                    data: null,
                    errrr: null,
                    msg: 'you are missing a required data entry!' + errrr.message
                });
            }
            //end catch
            Encryption.hashPassword(newUser.password, function (er, hash) {
                if (er) {
                    console.log('entered if er');

                    return next(er);
                }

                newUser.password = hash;
                User.create(newUser, function (erro) {
                    if (erro) {
                        console.log('entered if erro');

                        return next(erro);
                    }

                    return res.status(201).json({
                        data: newUser,
                        erro: null,
                        msg: 'Success!'
                    });
                });
            });
        }
    );
};
     //   User.findByIdAndUpdate(req.user._id, { $set: { isParent: true } });

   // var userid = req.params.userID;
    // User.findByIdAndUpdate(id, $set, { isParent: true });
    // end if

 /*   // --- Variable Assign --- //
    newUser.address = req.body.address;
    newUser.birthdate = req.body.birthdate;
    newUser.children = [];
    newUser.email = req.body.email;
    newUser.firstName = req.body.firstName;
    newUser.isChild = true;
    newUser.isParent = false;
    newUser.isTeacher = false;
    newUser.lastName = req.body.lastName;
    newUser.password = req.body.password;
    newUser.phone = req.body.phone;
    newUser.username = req.body.username;
    // --- End of "Variable Assign" --- //
    try {
        isString(newUser.address ? newUser.address : '');
        isDate(newUser.birthdate ? newUser.birthdate : new Date());
        isArray(newUser.children ? newUser.children : []);
        isString(newUser.email ? newUser.email : '');
        isString(newUser.firstName ? newUser.firstName : '');
        isBoolean(newUser.isChild ? newUser.isChild : false);
        isBoolean(newUser.isParent ? newUser.isParent : false);
        isBoolean(newUser.isTeacher ? newUser.isTeacher : false);
        isString(newUser.lastName ? newUser.lastName : '');
        isString(newUser.password ? newUser.password : '');
        isArray(newUser.phone ? newUser.phone : []);
        isString(newUser.username ? newUser.username : '');

    } catch (err) {
        return res.status(401).json({
            data: null,
            err: null,
            msg: 'your message does not match the required data entries!' + err.message
        });
    }
    //end catch

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
        return res.status(401).json({
            data: null,
            err: null,
            msg: 'you are missing a required data entry!' + err.message
        });
    }
    //end catch
    Encryption.hashPassword(newUser.password, function (er, hash) {
        if (er) {
            return next(er);
        }

        newUser.password = hash;
        newUser.save(function (er) {
            if (er) {
                throw er;
            }

            return next(null, newUser);
        });
    });


    newUser.save(function (err) {
        if (err) {
            throw err;
        }

        return res.status(201).json({
            data: newUser,
            err: null,
            msg: 'Success!'
        });
    });
};
*/