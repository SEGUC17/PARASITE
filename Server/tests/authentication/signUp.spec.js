/* eslint-disable */

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
var expect = chai.expect;
var should = chai.should();
var mockgoose = new Mockgoose(mongoose);
// --- End of "Dependancies" --- //

// --- Middleware --- //
chai.use(chaiHttp);
// --- End of "Middleware" --- //

describe('signUp', function () {

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });
    // --- End of "Mockgoose Initiation" --- //

    // --- Clearing Mockgoose --- //
    beforeEach(function (done) {
        this.johnDoe = {
            address: 'John Address Sample',
            birthdate: '1/1/1980',
            email: 'johndoe@gmail.com',
            firstName: 'John',
            isTeacher: true,
            lastName: 'Doe',
            password: 'JohnPasSWorD',
            phone: '123',
            username: 'john'
        };
        this.janeDoe = {
            address: 'Jane Address Sample',
            birthdate: '1/1/2000',
            email: 'janedoe@gmail.com',
            firstName: 'Jane',
            isTeacher: true,
            lastName: 'Doe',
            password: 'JanePasSWorD',
            phone: '123',
            username: 'jane'
        };
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    // --- Tests --- //
    describe('Failure', function () {
        it('User Is Already Signed In!', function (done) {
            chai.request(app).
                post('/api/signUp').
                send(this.johnDoe).
                end(function (err, res) {
                    token = res.body.token;
                    chai.request(app).
                        post(path).
                        send(this.janeDoe).
                        set('Authorization', res.body.token).
                        end(function (err2, res2) {
                            res2.should.have.status(403);
                            res2.body.should.have.property('msg').eql('User Is Already Signed In!');
                            done();
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
                    res.should.have.status(422);
                    res.body.should.have.property('msg').eql('Birthdate: Expected non-empty value!');
                    done();
                });
        });
        it('"birthdate" Attribute Is Not Valid!');
        it('"email" Attribute Is Empty!', function (done) {
            this.johnDoe.email = null;
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    res.should.have.status(422);
                    res.body.should.have.property('msg').eql('Email: Expected non-empty value!');
                    done();
                });
        });
        it('"email" Attribute Is Not Valid!');
        it('"firstName" Attribute Is Empty!', function (done) {
            this.johnDoe.firstName = null;
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    res.should.have.status(422);
                    res.body.should.have.property('msg').eql('First Name: Expected non-empty value!');
                    done();
                });
        });
        it('"firstName" Attribute Is Not Valid!');
        it('"isTeacher" Attribute Is Empty!', function (done) {
            this.johnDoe.isTeacher = null;
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    res.should.have.status(422);
                    res.body.should.have.property('msg').eql('Is Teacher: Expected non-empty value!');
                    done();
                });
        });
        it('"isTeacher" Attribute Is Not Valid!');
        it('"lastName" Attribute Is Empty!', function (done) {
            this.johnDoe.lastName = null;
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    res.should.have.status(422);
                    res.body.should.have.property('msg').eql('Last Name: Expected non-empty value!');
                    done();
                });
        });
        it('"lastName" Attribute Is Not Valid!');
        it('"password" Attribute Is Empty!', function (done) {
            this.johnDoe.password = null;
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    res.should.have.status(422);
                    res.body.should.have.property('msg').eql('Password: Expected non-empty value!');
                    done();
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
                    res.should.have.status(422);
                    res.body.should.have.property('msg').eql('Username: Expected non-empty value!');
                    done();
                });
        });
        it('"username" Attribute Is Not Valid!');
        it('"Age" Is Less Than 13!', function (done) {
            this.johnDoe.birthdate = Date();
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    res.should.have.status(422);
                    res.body.should.have.property('msg').eql('Can\'t Sign Up If User Under 13 Years Old!');
                    done();
                });
        });
        it('"Email" Is Not Valid!', function (done) {
            this.johnDoe.email = 'johndoe@gmail';
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    res.should.have.status(422);
                    res.body.should.have.property('msg').eql('Email Is Not Valid!');
                    done();
                });
        });
        it('"Password" Has Length Less Than 8', function (done) {
            this.johnDoe.password = 'JohnPaS';
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    res.should.have.status(422);
                    res.body.should.have.property('msg').eql('Password Length Must Be Greater Than 8!');
                    done();
                });
        });
        it('"Phone" Element(s) Is/Are Not Valid!', function (done) {
            this.johnDoe.phone = 'Wrong Number!';
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    res.should.have.status(422);
                    res.body.should.have.property('msg').eql('Phone Is Not Valid!');
                    done();
                });
        });
        it('"Email" Is A Duplicate!', function (done) {
            var self = this;
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    self.janeDoe.email = self.johnDoe.email;
                    chai.request(app).
                        post(path).
                        send(self.janeDoe).
                        end(function (err2, res2) {
                            res2.should.have.status(409);
                            res2.body.should.have.property('msg').eql('Email Is In Use!');
                            done();
                        });
                });
        });
        it('"Username" Is A Duplicate!', function (done) {
            var self = this;
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    self.janeDoe.username = self.johnDoe.username;
                    chai.request(app).
                        post(path).
                        send(self.janeDoe).
                        end(function (err2, res2) {
                            res2.should.have.status(409);
                            res2.body.should.have.property('msg').eql('Username Is In Use!');
                            done();
                        });
                });
        });
    });
    describe('Success!', function () {
        it('User Entered Valid Data!', function (done) {
            var self = this;
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    User.find({ 'username': self.johnDoe.username }, function (err, user) {
                        if (user) {
                            res.should.have.status(201);
                            res.body.should.have.property('msg').eql('Sign Up Is Successful!');
                            done();
                        } else {
                            done(new Error('User Was Not Added To DB!'));
                        }
                    });
                });
        });
        it('"Address" Is Lowered Case!', function (done) {
            var self = this;
            this.johnDoe.address = this.johnDoe.address.toUpperCase();
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    User.findOne({ 'username': self.johnDoe.username }, function (err, user) {
                        if (user) {
                            res.should.have.status(201);
                            res.body.should.have.property('msg').eql('Sign Up Is Successful!');
                            user.address.should.be.eql(self.johnDoe.address.toLowerCase());
                            done();
                        } else {
                            done(new Error('User Was Not Added To DB!'));
                        }
                    });
                });
        });
        it('"Email" Is Lowered Case!', function (done) {
            var self = this;
            this.johnDoe.email = this.johnDoe.email.toUpperCase();
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    User.findOne({ 'username': self.johnDoe.username }, function (err, user) {
                        if (user) {
                            res.should.have.status(201);
                            res.body.should.have.property('msg').eql('Sign Up Is Successful!');
                            user.email.should.be.eql(self.johnDoe.email.toLowerCase());
                            done();
                        } else {
                            done(new Error('User Was Not Added To DB!'));
                        }
                    });
                });
        });
        it('"Email" Is Trimmed!', function (done) {
            var self = this;
            this.johnDoe.email = '  ' + this.johnDoe.email + '  ';
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    User.findOne({ 'username': self.johnDoe.username }, function (err, user) {
                        if (user) {
                            res.should.have.status(201);
                            res.body.should.have.property('msg').eql('Sign Up Is Successful!');
                            user.email.should.be.eql(self.johnDoe.email.trim());
                            done();
                        } else {
                            done(new Error('User Was Not Added To DB!'));
                        }
                    });
                });
        });
        it('"Username" Is Lowered Case!', function (done) {
            var self = this;
            this.johnDoe.username = this.johnDoe.username.toUpperCase();
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    User.findOne({ 'username': self.johnDoe.username.toLowerCase() }, function (err, user) {
                        if (user) {
                            res.should.have.status(201);
                            res.body.should.have.property('msg').eql('Sign Up Is Successful!');
                            user.username.should.be.eql(self.johnDoe.username.toLowerCase());
                            done();
                        } else {
                            done(new Error('User Was Not Added To DB!'));
                        }
                    });
                });
        });
        it('"Username" Is Trimmed!', function (done) {
            var self = this;
            this.johnDoe.username = '  ' + this.johnDoe.username + '  ';
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function (err, res) {
                    User.findOne({ 'username': self.johnDoe.username.trim() }, function (err, user) {
                        if (user) {
                            res.should.have.status(201);
                            res.body.should.have.property('msg').eql('Sign Up Is Successful!');
                            user.username.should.be.eql(self.johnDoe.username.trim());
                            done();
                        } else {
                            done(new Error('User Was Not Added To DB!'));
                        }
                    });
                });
        });
        it('Password Is Hashed!');
        it('Token Is Sent After Signning Up!', function(done) {
            chai.request(app).
                post(path).
                send(this.johnDoe).
                end(function(err, res) {
                    res.body.should.have.property('token');
                    done();
                });
        });
        it('Token Expires In 12 Hours!');
    });
    // --- End of "Tests" --- //

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //

});