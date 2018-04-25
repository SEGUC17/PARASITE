/* eslint max-statements: ["error", 10, { "ignoreTopLevelFunctions": true }] */

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JWTStrategy = require('passport-jwt').Strategy;
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var path = '/api/signUp';
var User = require('../../api/models/User');
// --- End of "Requirements" --- //

// --- Dependancies --- //
var mockgoose = new Mockgoose(mongoose);
var should = chai.should();
// --- End of "Dependancies" --- //

// --- Middleware --- //
chai.use(chaiHttp);
// --- End of "Middleware" --- //

describe('signUp', function () {

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
                post('/api/signIn').
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
                        send(this.janeDoe).
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
    it('"address" Attribute Is Not Valid!');
    it('"birthdate" Attribute Is Empty!', function (done) {
        this.johnDoe.birthdate = null;
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Birthdate: Expected non-empty value!');

                return done();
            });
    });
    it('"birthdate" Attribute Is Not Valid!');
    it('"email" Attribute Is Empty!', function (done) {
        this.johnDoe.email = null;
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Email: Expected non-empty value!');

                return done();
            });
    });
    it('"email" Attribute Is Not Valid!');
    it('"firstName" Attribute Is Empty!', function (done) {
        this.johnDoe.firstName = null;
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('First Name: Expected non-empty value!');

                return done();
            });
    });
    it('"firstName" Attribute Is Not Valid!');
    it('"isTeacher" Attribute Is Empty!', function (done) {
        this.johnDoe.isTeacher = null;
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Is Teacher: Expected non-empty value!');

                return done();
            });
    });
    it('"isTeacher" Attribute Is Not Valid!');
    it('"lastName" Attribute Is Empty!', function (done) {
        this.johnDoe.lastName = null;
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Last Name: Expected non-empty value!');

                return done();
            });
    });
    it('"lastName" Attribute Is Not Valid!');
    it('"password" Attribute Is Empty!', function (done) {
        this.johnDoe.password = null;
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Password: Expected non-empty value!');

                return done();
            });
    });
    it('"password" Attribute Is Not Valid!');
    it('"phone" Attribute Is Not Valid!');
    it('"phone" Attribute Element(s) Is/Are Not Valid');
    it('"username" Attribute Is Empty!', function (done) {
        this.johnDoe.username = null;
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Username: Expected non-empty value!');

                return done();
            });
    });
    it('"username" Attribute Is Not Valid!');
    it('"Age" Is Less Than 13!', function (done) {
        this.johnDoe.birthdate = Date();
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Can\'t Sign Up If User Under 13 Years Old!');

                return done();
            });
    });
    it('"Email" Is Not Valid!', function (done) {
        this.johnDoe.email = 'johndoe@gmail';
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Email Is Not Valid!');

                return done();
            });
    });
    it('"Password" Has Length Less Than 8', function (done) {
        this.johnDoe.password = 'JohnPaS';
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Password Length Must Be Greater Than 8!');

                return done();
            });
    });
    it('"Phone" Element(s) Is/Are Not Valid!', function (done) {
        this.johnDoe.phone = 'Wrong Number!';
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Phone Is Not Valid!');

                return done();
            });
    });
    it('"Email" Is A Duplicate!', function (done) {
        var that = this;
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                that.janeDoe.email = that.johnDoe.email;
                chai.request(app).
                    post(path).
                    send(that.janeDoe).
                    end(function (err2, res2) {
                        if (err2) {
                            return done(err2);
                        }

                        res2.should.have.status(409);
                        res2.body.should.have.property('msg').
                            eql('Email Is In Use!');

                        return done();
                    });
            });
    });
    it('"Username" Is A Duplicate!', function (done) {
        var that = this;
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                that.janeDoe.username = that.johnDoe.username;
                chai.request(app).
                    post(path).
                    send(that.janeDoe).
                    end(function (err2, res2) {
                        if (err2) {
                            return done(err2);
                        }

                        res2.should.have.status(409);
                        res2.body.should.have.property('msg').
                            eql('Username Is In Use!');

                        return done();
                    });
            });
    });
    it('User Entered Valid Data!', function (done) {
        var that = this;
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(201);
                res.body.should.have.property('msg').
                    eql('Sign Up Is Successful!\n' +
                        'Verification Mail Was Sent To Your Email!');

                User.findOne(
                    { 'username': that.johnDoe.username },
                    function (err2, user) {
                        if (err2) {
                            return done(err2);
                        } else if (!user) {
                            return done(new Error('User Was Not Added To DB!'));
                        }

                        return done();
                    }
                );
            });
    });
    it('"Address" Is Lowered Case!', function (done) {
        var that = this;
        this.johnDoe.address = this.johnDoe.address.toUpperCase();
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(201);
                res.body.should.have.property('msg').
                    eql('Sign Up Is Successful!\n' +
                        'Verification Mail Was Sent To Your Email!');
                User.findOne(
                    { 'username': that.johnDoe.username },
                    function (err2, user) {
                        if (err2) {
                            return done(err2);
                        } else if (!user) {
                            return done(new Error('User Was Not Added To DB!'));
                        }

                        user.address.should.be.
                            eql(that.johnDoe.address.toLowerCase());

                        return done();
                    }
                );
            });
    });
    it('"Email" Is Lowered Case!', function (done) {
        var that = this;
        this.johnDoe.email = this.johnDoe.email.toUpperCase();
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(201);
                res.body.should.have.property('msg').
                    eql('Sign Up Is Successful!\n' +
                        'Verification Mail Was Sent To Your Email!');
                User.findOne(
                    { 'username': that.johnDoe.username },
                    function (err2, user) {
                        if (err2) {
                            return done(err2);
                        } else if (!user) {
                            return done(new Error('User Was Not Added To DB!'));
                        }

                        user.email.should.be.
                            eql(that.johnDoe.email.toLowerCase());

                        return done();
                    }
                );
            });
    });
    it('"Email" Is Trimmed!', function (done) {
        var that = this;
        this.johnDoe.email = '  ' + this.johnDoe.email + '  ';
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(201);
                res.body.should.have.property('msg').
                    eql('Sign Up Is Successful!\n' +
                        'Verification Mail Was Sent To Your Email!');
                User.findOne(
                    { 'username': that.johnDoe.username },
                    function (err2, user) {
                        if (err2) {
                            return done(err2);
                        } else if (!user) {
                            return done(new Error('User Was Not Added To DB!'));
                        }

                        user.email.should.be.
                            eql(that.johnDoe.email.trim());

                        return done();
                    }
                );
            });
    });
    it('"Username" Is Lowered Case!', function (done) {
        var that = this;
        this.johnDoe.username = this.johnDoe.username.toUpperCase();
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(201);
                res.body.should.have.property('msg').
                    eql('Sign Up Is Successful!\n' +
                        'Verification Mail Was Sent To Your Email!');
                User.findOne(
                    { 'username': that.johnDoe.username.toLowerCase() },
                    function (err2, user) {
                        if (err2) {
                            return done(err2);
                        } else if (!user) {
                            return done(new Error('User Was Not Added To DB!'));
                        }

                        user.username.should.be.
                            eql(that.johnDoe.username.toLowerCase());

                        return done();
                    }
                );
            });
    });
    it('"Username" Is Trimmed!', function (done) {
        var that = this;
        this.johnDoe.username = '  ' + this.johnDoe.username + '  ';
        chai.request(app).
            post(path).
            send(this.johnDoe).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(201);
                res.body.should.have.property('msg').
                    eql('Sign Up Is Successful!\n' +
                        'Verification Mail Was Sent To Your Email!');
                User.findOne(
                    { 'username': that.johnDoe.username.trim() },
                    function (err2, user) {
                        if (err2) {
                            return done(err2);
                        } else if (!user) {
                            return done(new Error('User Was Not Added To DB!'));
                        }

                        user.username.should.be.
                            eql(that.johnDoe.username.trim());

                        return done();
                    }
                );
            });
    });
    it('Password Is Hashed!');
    // --- End of "Tests" --- //

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            return done();
        });
    });
    // --- End of "Mockgoose Termination" --- //

});
