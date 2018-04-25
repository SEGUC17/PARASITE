/* eslint max-statements: ["error", 10, { "ignoreTopLevelFunctions": true }] */
/* eslint max-len: ["error", 100] */

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var path = '/api/signIn';
var User = require('../../api/models/User');
// --- End of "Requirements" --- //

// --- Dependancies --- //
var mockgoose = new Mockgoose(mongoose);
var should = chai.should();
// --- End of "Dependancies" --- //

// --- Middleware --- //
chai.use(chaiHttp);
// --- End of "Middleware" --- //

describe('signIn', function () {

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                return done();
            });
        });
    });
    // --- End of "Mockgoose Initiation" --- //

    // --- Clearing Mockgoose --- //
    beforeEach(function (done) {
        this.johnDoe = {
            address: 'John Address Sample',
            birthdate: '1/1/1980',
            email: 'johndoe@s.s',
            firstName: 'John',
            isEmailVerified: true,
            isTeacher: true,
            lastName: 'Doe',
            password: 'JohnPasSWorD',
            phone: '123',
            username: 'john'
        };
        this.janeDoe = {
            address: 'Jane Address Sample',
            birthdate: '1/1/2000',
            email: 'janedoe@s.s',
            firstName: 'Jane',
            isTeacher: true,
            lastName: 'Doe',
            password: 'JanePasSWorD',
            phone: '123',
            username: 'jane'
        };
        mockgoose.helper.reset().then(function () {
            return done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    // --- Tests --- //
    it('User Is Already Signed In!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': that.johnDoe.username
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    chai.request(app).
                        post(path).
                        send({
                            'password': that.janeDoe.password,
                            'username': that.janeDoe.username
                        }).
                        set('Authorization', res.body.token).
                        end(function (err3, res2) {
                            if (err3) {
                                return done(err3);
                            }

                            res2.should.have.status(403);
                            res2.body.should.have.property('msg').
                                eql('User Is Already Signed In!');

                            return done();
                        });

                });
        });
    });
    it('Token Expires In More Than 12 Hours!');
    it('"password" Attribute Is Empty!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': null,
                    'username': that.johnDoe.username
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.should.have.status(422);
                    res.body.should.have.property('msg').
                        eql('Password: Expected non-empty value!');

                    return done();
                });
        });
    });
    it('"password" Attribute Is Not Valid!');
    it('"username" Attribute Is Empty!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': null
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.should.have.status(422);
                    res.body.should.have.property('msg').
                        eql('Username: Expected non-empty value!');

                    return done();
                });
        });
    });
    it('"username" Attribute Is Not Valid!');
    it('"Username" Is Wrong!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': that.johnDoe.username + ' Is Wrong!'
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.should.have.status(422);
                    res.body.should.have.property('msg').
                        eql('Wrong Username/Email Or Password!');

                    return done();
                });
        });
    });
    it('"Email" Is Wrong!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': that.johnDoe.email + ' Is Wrong!'
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.should.have.status(422);
                    res.body.should.have.property('msg').
                        eql('Wrong Username/Email Or Password!');

                    return done();
                });
        });
    });
    it('"Password" Is Wrong!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password + ' Is Wrong!',
                    'username': that.johnDoe.username
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.should.have.status(422);
                    res.body.should.have.property('msg').
                        eql('Wrong Username/Email Or Password!');

                    return done();
                });
        });
    });
    it('User Entered Valid Data (Email)!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': that.johnDoe.email
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.should.have.status(200);
                    res.body.should.have.property('msg').
                        eql('Sign In Is Successful!');

                    return done();
                });
        });
    });
    it('User Entered Valid Data (Email Has Upper Case)!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': that.johnDoe.email.toUpperCase()
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.should.have.status(200);
                    res.body.should.have.property('msg').
                        eql('Sign In Is Successful!');

                    return done();
                });
        });
    });
    it('User Entered Valid Data (Email Has Space)!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': '  ' + that.johnDoe.email + '  '
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.should.have.status(200);
                    res.body.should.have.property('msg').
                        eql('Sign In Is Successful!');

                    return done();
                });
        });
    });
    it('User Entered Valid Data (Username)!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': that.johnDoe.username
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.should.have.status(200);
                    res.body.should.have.property('msg').
                        eql('Sign In Is Successful!');

                    return done();
                });
        });
    });
    it('User Entered Valid Data (Username Has Upper Case)!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': that.johnDoe.username.toUpperCase()
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.should.have.status(200);
                    res.body.should.have.property('msg').
                        eql('Sign In Is Successful!');

                    return done();
                });
        });
    });
    it('User Entered Valid Data (Username Has Space)!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': '  ' + that.johnDoe.username + '  '
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.should.have.status(200);
                    res.body.should.have.property('msg').
                        eql('Sign In Is Successful!');

                    return done();
                });
        });
    });
    it('Token Is Sent After Signning In!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': that.johnDoe.username
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    res.body.should.have.property('token');

                    return done();
                });
        });
    });
    it('Token Expires In 12 Hours (No Remember Me)!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'username': that.johnDoe.username
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    jwt.verify(
                        res.body.token.substring(4),
                        config.SECRET,
                        function (err3, decoded) {
                            if (err3) {
                                return done(err3);
                            }

                            (new Date(decoded.exp) - new Date(decoded.iat)).should.be.
                                eql(12 * 3600);

                            return done();
                        }
                    );
                });
        });
    });
    it('Token Expires In 1 Week (With Remember Me)!', function (done) {
        var that = this;
        User.create(this.johnDoe, function (err) {
            if (err) {
                return done(err);
            }

            chai.request(app).
                post(path).
                send({
                    'password': that.johnDoe.password,
                    'rememberMe': true,
                    'username': that.johnDoe.username
                }).
                end(function (err2, res) {
                    if (err2) {
                        return done(err2);
                    }

                    jwt.verify(
                        res.body.token.substring(4),
                        config.SECRET,
                        function (err3, decoded) {
                            if (err3) {
                                return done(err3);
                            }

                            (new Date(decoded.exp) - new Date(decoded.iat)).should.be.
                                eql(7 * 24 * 3600);

                            return done();
                        }
                    );
                });
        });
    });
    // --- End of "Tests" --- //

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            return done();
        });
    });
    // --- End of "Mockgoose Termination" --- //

});
