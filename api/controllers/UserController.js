/* eslint-disable max-statements */
/* eslint-disable complexity */

// ---------------------- Requirements ---------------------- //
var emailVerification = require('../utils/emails/email-verification');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var REGEX = require('../utils/validators/REGEX');
var mongoose = require('mongoose');
var User = mongoose.model('User');
// ---------------------- End of "Requirements" ---------------------- //


// ---------------------- Validators ---------------------- //
var isArray = require('../utils/validators/is-array');
var isBoolean = require('../utils/validators/is-boolean');
var isDate = require('../utils/validators/is-date');
var isString = require('../utils/validators/is-string');
var isNotEmpty = require('../utils/validators/not-empty');
var Encryption = require('../utils/encryption/encryption');
// ---------------------- End of "Validators" ---------------------- //


// ---------------------- JWT Token Generator ---------------------- //
var generateJWTToken = function (id, time, callback) {
    callback('JWT ' + jwt.sign(
        { 'id': id },
        config.SECRET,
        { expiresIn: time }
    ));
};
// ---------------------- End of "JWT Token Generator" ---------------------- //

module.exports.signUp = function (req, res, next) {

    // --- Variable Assign --- //
    var newUser = new User({
        address: req.body.address,
        birthdate: req.body.birthdate,
        email: req.body.email,
        firstName: req.body.firstName,
        isTeacher: req.body.isTeacher,
        lastName: req.body.lastName,
        password: req.body.password,
        phone: req.body.phone,
        username: req.body.username
    });
    // --- End of "Variable Assign" --- //

    // --- Check: Emptinesss & Type --- //
    var field = '';
    try {

        field = 'Address';
        isString(newUser.address ? newUser.address : '');

        field = 'Birthdate';
        isNotEmpty(newUser.birthdate);
        isDate(newUser.birthdate);

        field = 'Email';
        isNotEmpty(newUser.email);
        isString(newUser.email);

        field = 'First Name';
        isNotEmpty(newUser.firstName);
        isString(newUser.firstName);

        field = 'Is Teacher';
        isNotEmpty(newUser.isTeacher);
        isBoolean(newUser.isTeacher);

        field = 'Last Name';
        isNotEmpty(newUser.lastName);
        isString(newUser.lastName);

        field = 'Password';
        isNotEmpty(newUser.password);
        isString(newUser.password);

        field = 'Phone';
        isArray(newUser.phone ? newUser.phone : []);
        for (var index = 0; index < newUser.phone.length; index += 1) {
            isString(newUser.phone[index]);
        }

        field = 'Username';
        isNotEmpty(newUser.username);
        isString(newUser.username);

    } catch (err) {
        return res.status(422).json({
            data: null,
            err: null,
            msg: field + ': ' + err.message + '!'
        });
    }
    // --- End of "Check: Emptinesss & Type" --- //

    // --- Trimming & Lowering Cases--- //
    newUser.address = newUser.address
        ? newUser.address.toLowerCase()
        : newUser.address;
    newUser.email = newUser.email
        ? newUser.email.toLowerCase().trim()
        : newUser.email;
    newUser.username = newUser.username
        ? newUser.username.toLowerCase().trim()
        : newUser.username;
    // --- End of "Trimming & Lowering Cases"--- //

    // --- Check: birthdate --- //
    if (new Date().getFullYear() - newUser.birthdate.getFullYear() < 13) {
        return res.status(422).json({
            data: null,
            err: null,
            msg: 'Can\'t Sign Up If User Under 13 Years Old!'
        });
    }
    // --- End of "Check: birthdate" --- //

    // --- Check: Email Regex Match --- //
    if (!newUser.email.match(REGEX.MAIL_REGEX)) {
        return res.status(422).json({
            data: null,
            err: null,
            msg: 'Email Is Not Valid!'
        });
    }
    // --- End of "Check: Email Regex Match" --- //

    // --- Check: Password Length --- //
    if (newUser.password.length < 8) {
        return res.status(422).json({
            data: null,
            err: null,
            msg: 'Password Length Must Be Greater Than 8!'
        });
    }
    // --- End of "Check: Password Length" --- //

    // --- Check: Phone Regex Match ---//
    for (var index2 = 0; index2 < newUser.phone.length; index2 += 1) {
        if (!newUser.phone[index2].match(REGEX.PHONE_REGEX)) {
            return res.status(422).json({
                data: null,
                err: null,
                msg: 'Phone Is Not Valid!'
            });
        }
    }
    // --- End of "Check: Phone Regex Match" ---//

    // --- Check: Duplicate Username/Email --- //
    User.findOne(
        {
            $or: [
                { 'email': newUser.email },
                { 'username': newUser.username }
            ]
        },
        function (err, user) {
            if (err) {
                throw err;
            } else if (user) {
                if (user.email === newUser.email) {
                    return res.status(409).json({
                        data: null,
                        err: null,
                        msg: 'Email Is In Use!'
                    });
                }

                return res.status(409).json({
                    data: null,
                    err: null,
                    msg: 'Username Is In Use!'
                });
            }

            newUser.save(function (err2, user2) {
                if (err2) {
                    throw err2;
                }

                emailVerification.send(
                    user2.email,
                    config.FRONTEND_URI + 'auth/verifyEmail/' + user2._id
                );

                return res.status(201).json({
                    data: null,
                    err: null,
                    msg: 'Sign Up Is Successful!\n' +
                        'Verification Mail Was Sent To Your Email!'
                });
            });
        }
    );
    // --- End of "Check: Duplicate Username/Email" --- //
};

module.exports.verifyChildEmail = function (req, res, next) {
console.log('entered the verification for child email');
    User.findByIdAndUpdate(
        req.params.id,
        { 'isEmailVerified': true },
        function (err, user) {
            if (err) {
                console.log('entered error');
                throw err;
            } else if (!user) {
                console.log('entered error of not user');

                return res.status(404).json({
                    data: null,
                    err: null,
                    msg: 'User Not Found!'
                });
            }
       console.log('res is 200 ');
       console.log('isEmailVerified : ', user.isEmailVerified);

            return res.status(200).json({
                data: null,
                err: null,
                msg: 'Email Verification Is Successful!'
            });
        }
    );

};

module.exports.verifyEmail = function (req, res, next) {

    User.findByIdAndUpdate(
        req.params.id,
        { 'isEmailVerified': true },
        function (err, user) {
            if (err) {
                throw err;
            } else if (!user) {
                return res.status(404).json({
                    data: null,
                    err: null,
                    msg: 'User Not Found!'
                });
            }

            var time = '12h';
            generateJWTToken(user._id, time, function (jwtToken) {
                return res.status(200).json({
                    data: null,
                    err: null,
                    msg: 'Email Verification Is Successful!',
                    token: jwtToken
                });
            });
        }
    );

};

module.exports.signIn = function (req, res, next) {

    // --- Check: Emptinesss & Type --- //
    var field = '';
    try {

        field = 'Password';
        isNotEmpty(req.body.password);
        isString(req.body.password);

        field = 'Username';
        isNotEmpty(req.body.username);
        isString(req.body.username);

    } catch (err) {
        return res.status(422).json({
            data: null,
            err: null,
            msg: field + ': ' + err.message + '!'
        });
    }
    // --- End of "Check: Emptinesss & Type" --- //

    req.body.username = req.body.username
        ? req.body.username.toLowerCase().trim()
        : '';

    User.findOne(
        {
            $or: [
                { 'email': req.body.username },
                { 'username': req.body.username }
            ]
        },
        function (err, user) {
            if (err) {
                throw err;
            } else if (!user) {
                return res.status(422).json({
                    data: null,
                    err: null,
                    msg: 'Wrong Username/Email Or Password!'
                });
            } else if (!user.isEmailVerified) {
                return res.status(422).json({
                    data: null,
                    err: null,
                    msg: 'Email Is Not Verified!'
                });
            } else if (user.isBanned) {
                return res.status(422).json({
                    data: null,
                    err: null,
                    msg: 'User Is Banned!'
                });
            }

            user.comparePasswords(
                req.body.password,
                function (err2, passwordMatches) {
                    if (err2) {
                        throw err2;
                    } else if (!passwordMatches) {
                        return res.status(422).json({
                            data: null,
                            err: null,
                            msg: 'Wrong Username/Email Or Password!'
                        });
                    }

                    var time = req.body.rememberMe ? '1w' : '12h';
                    generateJWTToken(user._id, time, function (jwtToken) {
                        return res.status(200).json({
                            data: null,
                            err: null,
                            msg: 'Sign In Is Successful!',
                            token: jwtToken
                        });
                    });
                }
            );
        }
    );

};

module.exports.signInWithThirdPartyResponse = function(req, res, next) {
    var time = '1d';
    generateJWTToken(req.user._id, time, function (jwtToken) {
        return res.status(200).json({
            data: null,
            err: null,
            msg: 'Sign In Is Successful!',
            token: jwtToken
        });
    });
};

module.exports.signUpChild = function (req, res, next) {
    // to make the user a parent
    console.log('entered the signUpChild method');
    // console.log('userId is: ' + req.user._id);
    // console.log('username is: ' + req.user.username);

    var newUser = new User();
    // --- Variable Assign --- //
    //  console.log('about to set attributes of child');
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

    //  console.log('updated attributes of child set');

    //---types and formats validations--////
    var field = '';
    try {
        field = 'Address';
        isString(newUser.address ? newUser.address : '');
        field = 'Birtdate';
        isDate(newUser.birthdate ? newUser.birthdate : new Date());
        isArray(newUser.children ? newUser.children : []);
        field = 'Email';
        isString(newUser.email ? newUser.email : '');
        field = 'First name';
        isString(newUser.firstName ? newUser.firstName : '');
        isBoolean(newUser.isChild ? newUser.isChild : false);
        isBoolean(newUser.isParent ? newUser.isParent : false);
        isBoolean(newUser.isTeacher ? newUser.isTeacher : false);
        field = 'Last Name';
        isString(newUser.lastName ? newUser.lastName : '');
        field = 'Password';
        isString(newUser.password ? newUser.password : '');
        field = 'Phone';
        isArray(newUser.phone ? newUser.phone : []);
        field = 'Username';
        isString(newUser.username ? newUser.username : '');

    } catch (err1) {
        //    console.log('entered catch of status 401');

        return res.status(401).json({
            data: null,
            err1: null,
            msg: field +
                ' does not match the required data entry!'
        });
    }
    //---end of types and formats validations--///

    //---emptiness validations--/////
    try {
        //   console.log('entered try of is empty');
        field = 'Birtdate';
        isNotEmpty(newUser.birthdate);
        field = 'Email';
        isNotEmpty(newUser.email);
        field = 'First name';
        isNotEmpty(newUser.firstName);
        isNotEmpty(newUser.isChild);
        isNotEmpty(newUser.isParent);
        isNotEmpty(newUser.isTeacher);
        field = 'Last Name';
        isNotEmpty(newUser.lastName);
        field = 'Password';
        isNotEmpty(newUser.password);
        field = 'Username';
        isNotEmpty(newUser.username);
    } catch (err2) {

        return res.status(401).json({
            data: null,
            err2: null,
            msg: 'you are missing required data entry'
        });
    }
    //---end of emptiness validations--////

    // --- Trimming & Lowering Cases--- //
    newUser.address = newUser.address
        ? newUser.address.toLowerCase()
        : newUser.address;
    newUser.email = newUser.email
        ? newUser.email.toLowerCase().trim()
        : newUser.email;
    newUser.username = newUser.username
        ? newUser.username.toLowerCase().trim()
        : newUser.username;
    // --- End of "Trimming & Lowering Cases"--- //
    // --- Check: Phone Regex Match ---//
    for (var index2 = 0; index2 < newUser.phone.length; index2 += 1) {
        if (!newUser.phone[index2].match(REGEX.PHONE_REGEX)) {
            return res.status(422).json({
                data: null,
                err5: null,
                msg: 'Phone Is Not Valid!'
            });
        }
    }
    // --- End of "Check: Phone Regex Match" ---//
    // --- Check: Email Regex Match --- //
    if (!newUser.email.match(REGEX.MAIL_REGEX)) {
        return res.status(422).json({
            data: null,
            err6: null,
            msg: 'Email Is Not Valid!'
        });
    }
    // --- End of "Check: Email Regex Match" --- //

    // --- Check: Password Length --- //
    if (newUser.password.length < 8) {
        return res.status(422).json({
            data: null,
            err7: null,
            msg: 'Password Length Must Be Greater Than 8!'
        });
    }
    // --- End of "Check: Password Length" --- //
    User.findOne(
        {
            $or: [
                { 'email': newUser.email },
                { 'username': newUser.username }
            ]
        },
        function (err8, user) {
            if (err8) {
                throw err8;
            } else if (user) {
                if (user.email === newUser.email) {
                    return res.status(409).json({
                        data: null,
                        err8: null,
                        msg: 'Email already exists!'
                    });
                }

                return res.status(409).json({
                    data: null,
                    err8: null,
                    msg: 'Username already exists!'
                });
            }
            //---end of duplicate checks--//

            //--hashing password--//
            User.create(newUser, function (error, user2) {
                if (error) {
                    //  console.log('entered if error');

                    return next(error);
                }
                emailVerification.send(
                    user2.email,
                    config.FRONTEND_URI + 'auth/verifyChildEmail/' + user2._id
                );

                // --- Variable Assign --- //
                return res.status(201).json({
                    data: null,
                    error: null,
                    msg: 'Child Sign Up is Successful!\n' +
                    'Verification Mail Was Sent To Your Child\'s Email!'
                });
            });
        }
    );
    User.findByIdAndUpdate(
        req.user._id, {
            $push:
                { 'children': req.body.username },
            $set:
                { 'isParent': true }
        }
        , { new: true }, function (err, updatedob) {
            if (err) {
                //  console.log('entered the error stage of update');

                return res.status(402).json({
                    data: null,
                    msg: 'error occurred during updating ' +
                        'parents attributes, parent is: ' +
                        req.user._id.isParent
                });
            }
        }
    );
};

module.exports.getUserData = function (req, res, next) {

    // --- Check: Emptiness & Type --- //
    var field = '';
    try {

        field = 'Request Body';
        isNotEmpty(req.body);
        isArray(req.body);

        field = 'Request Body Element(s)';
        for (var index = 0; index < req.body.length; index += 1) {
            isString(req.body[index]);
        }

    } catch (err) {
        return res.status(422).json({
            data: null,
            err: null,
            msg: field + ': ' + err.message + '!'
        });
    }
    // --- End of "Check: Emptiness & Type" --- //

    // --- Load User Data From req.user --- //
    var userData = {};
    for (var index2 = 0; index2 < req.body.length; index2 += 1) {
        userData[req.body[index2]] = req.user[req.body[index2]];
    }
    // --- End of "Load User Data From req.user" --- //

    // --- Security Check --- //
    delete userData.password;
    // --- End of "Security Check" --- //

    return res.status(200).json({
        data: userData,
        err: null,
        msg: 'Data Retrieval Is Successful!'
    });

};

module.exports.getAnotherUserData = function (req, res, next) {

    req.params.usernameOrEmail = req.params.usernameOrEmail.
        toLowerCase().trim();

    // --- Check: Emptiness & Type --- //
    var field = '';
    try {

        field = 'Request Body';
        isNotEmpty(req.body);
        isArray(req.body);

        field = 'Request Body Element(s)';
        for (var index = 0; index < req.body.length; index += 1) {
            isString(req.body[index]);
        }

    } catch (err) {
        return res.status(422).json({
            data: null,
            err: null,
            msg: field + ': ' + err.message + '!'
        });
    }
    // --- End of "Check: Emptiness & Type" --- //

    User.findOne(
        {
            $or: [
                { 'email': req.params.usernameOrEmail },
                { 'username': req.params.usernameOrEmail }
            ]
        },
        function (err, user) {
            if (err) {
                throw err;
            } else if (!user) {
                return res.status(404).json({
                    data: null,
                    err: null,
                    msg: 'User Not Found!'
                });
            }

            // --- Load User Data From req.user --- //
            var userData = {};
            for (var index2 = 0; index2 < req.body.length; index2 += 1) {
                userData[req.body[index2]] = user[req.body[index2]];
            }
            // --- End of "Load User Data From req.user" --- //

            // --- Security Check --- //
            delete userData.password;
            if (
                !req.user.isAdmin &&
                !req.user.children.includes(user.username) &&
                req.user.username !== user.username
            ) {
                delete userData.schedule;
                delete userData.studyPlans;
            }
            // --- End of "Security Check" --- //

            return res.status(200).json({
                data: userData,
                err: null,
                msg: 'Data Retrieval Is Successful!'
            });
        }
    );

};

module.exports.isUserExist = function (req, res, next) {

    req.params.usernameOrEmail = req.params.usernameOrEmail.
        toLowerCase().trim();

    User.findOne(
        {
            $or: [
                { 'email': req.params.usernameOrEmail },
                { 'username': req.params.usernameOrEmail }
            ]
        },
        function (err, user) {
            if (err) {
                throw err;
            } else if (user) {
                return res.status(409).json({
                    data: null,
                    err: null,
                    msg: 'User Found!'
                });
            }

            return res.status(404).json({
                data: null,
                err: null,
                msg: 'User Not Found!'
            });
        }
    );

};

module.exports.forgotPassword = function (req, res, next) {
    // email input gets trimmed of spaces
    req.params.email = req.params.email.toLowerCase().trim();
    // check is the user exists
    User.findOne(
        { email: req.params.email },
        function (err, user) {
            if (err) {
                throw err;
            } else if (user) {
                // user exists in database
                console.log(user.firstName);
                emailVerification.send(
                    user.email,
                    config.FRONTEND_URI +
                    'auth/forgotPassword/resetpassword/' + user._id
                );

                return res.status(201).json({
                    data: null,
                    err: null,
                    msg: 'An email was sent to the provided email'
                });
                // user does not exist
            } else if (!user) {
                return res.status(404).json({
                    data: null,
                    err: null,
                    msg: 'There is no account for the provided email address!'
                });
            }

        }
    );

};

module.exports.resetPassword = function (req, res, next) {
    // User identified by ID
    User.findById({ '_id': req.params.id }, function (err, user) {
        if (err) {
            return next(err);
        } else if (user) {
            // new password gets hashed
            Encryption.hashPassword(req.body.newpw, function (errors, hash) {
                if (errors) {
                    return next(errors);
                }
                // new hashed password replaces old one
                User.findByIdAndUpdate(
                    { '_id': req.params.id },
                    { 'password': hash }, function (error) {
                        if (error) {
                            return next(error);
                        }
                    }
                );

                return res.status(200).json({
                    data: null,
                    err: null,
                    msg: 'User password was reset successfully.'
                });
            });
        }
    });
};

