/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable object-shorthand */

// ---------------------- Requirements ---------------------- //
var config = require('../config/config');
var jwt = require('jsonwebtoken');
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
var generateJWTToken = function (id, callback) {
    callback('JWT ' + jwt.sign({ 'id': id }, config.SECRET, { expiresIn: '12h' }));
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
    newUser.address = newUser.address ? newUser.address.toLowerCase() : newUser.address;
    newUser.email = newUser.email ? newUser.email.toLowerCase().trim() : newUser.email;
    newUser.username = newUser.username ? newUser.username.toLowerCase().trim() : newUser.username;
    // --- End of "Trimming & Lowering Cases"--- //

    // --- Check: birthdate --- //
    if (new Date().getFullYear() - newUser.birthdate.getFullYear() < 13) {
        return res.status(422).json({
            data: null,
            err: null,
            msg: 'Under 13 Must Be Child!'
        });
    }
    // --- End of "Check: birthdate" --- //

    // --- Check: Email Regex Match --- //
    if (!newUser.email.match(config.EMAIL_REGEX)) {
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
        if (!newUser.phone[index2].match(config.PHONE_REGEX)) {
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

            newUser.save(function (err2) {
                if (err2) {
                    throw err2;
                }

                generateJWTToken(newUser._id, function (jwtToken) {
                    return res.status(201).json({
                        data: null,
                        err: null,
                        msg: 'Sign Up Is Successful!',
                        token: jwtToken
                    });
                });
            });
        }
    );
    // --- End of "Check: Duplicate Username/Email" --- //
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

    req.body.username = req.body.username ? req.body.username.toLowerCase().trim() : '';

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
            }

            user.comparePasswords(req.body.password, function (err2, passwordMatches) {
                if (err2) {
                    throw err2;
                } else if (!passwordMatches) {
                    return res.status(422).json({
                        data: null,
                        err: null,
                        msg: 'Wrong Username/Email Or Password!'
                    });
                }

                generateJWTToken(user._id, function (jwtToken) {
                    return res.status(200).json({
                        data: null,
                        err: null,
                        msg: 'Sign In Is Successfull!',
                        token: jwtToken
                    });
                });
            });
        }
    );

};


module.exports.signUpChild = function (req, res, next) {
    // to make the user a parent
    console.log('entered the signUpChild method');
    console.log('user is: ' + req.user._id);
    User.findByIdAndUpdate(
        req.user._id, {
            $set: {
                'children': req.body.username,
                'isParent': true
            }
        }
        , { new: true }, function (err, updatedob) {
            if (err) {
                console.log('entered the error stage of update');

                return res.status(402).json({
                    data: null,
                    msg: 'error occurred during updating parents attributes , parent is:' + req.user._id.isParent
                });
            }
            var newUser = new User();

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

            } catch (err1) {
                console.log('entered catch of status 401');

                return res.status(401).json({
                    data: null,
                    err1: null,
                    msg: 'your message does not match the required data entries!' + err1.message + '!' + '!'
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
            } catch (err2) {
                console.log('entered catch of 2nd status 401');
                console.log(newUser.birthdate);
                console.log(newUser.email);
                console.log(newUser.firstName);
                console.log(newUser.isChild);
                console.log(newUser.isParent);
                console.log(newUser.isTeacher);
                console.log(newUser.lastName);
                console.log(newUser.password);
                console.log(newUser.username);

                return res.status(401).json({
                    data: null,
                    err2: null,
                    msg: 'you are missing a required data entry!' + err2.message + '!'
                });
            }
            //end catch
            Encryption.hashPassword(newUser.password, function (err3, hash) {
                if (err3) {
                    console.log('entered if err3');

                    return next(err3);
                }

                newUser.password = hash;
                User.create(newUser, function (error) {
                    if (error) {
                        console.log('entered if error');

                        return next(error);
                    }

                    // --- Variable Assign --- //
                    return res.status(201).json({
                        data: newUser,
                        error: null,
                        msg: 'Success!'
                    });
                });
            });
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

    req.params.usernameOrEmail = req.params.usernameOrEmail.toLowerCase().trim();

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
                    msg: 'User Not Found'
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

    req.params.usernameOrEmail = req.params.usernameOrEmail.toLowerCase().trim();

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
                    msg: 'Exists!'
                });
            }

            return res.status(200).json({
                data: null,
                err: null,
                msg: 'Not Exists!'
            });
        }
    );

};
