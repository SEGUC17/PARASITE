/* eslint-disable */

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var path = '/api/signIn';
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

describe('signIn', function () {

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
        it('User Is Already Signed In!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': self.johnDoe.username, 'password': self.johnDoe.password}).
                    end(function(err, res) {
                        chai.request(app).
                            post(path).
                            send({'username': self.janeDoe.username, 'password': self.janeDoe.password}).
                            set('Authorization', res.body.token).
                            end(function(err2, res2) {
                                res2.should.have.status(403);
                                res2.body.should.have.property('msg').eql('User Is Already Signed In!');
                                done();
                            });
                    });
            });
        });
        it('Token Expires In More Than 12 Hours!');
        it('"password" Attribute Is Empty!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': self.johnDoe.username, 'password': null}).
                    end(function(err, res) {
                        res.should.have.status(422);
                        res.body.should.have.property('msg').eql('Password: Expected non-empty value!');
                        done();
                    });
            });
        });
        it('"password" Attribute Is Not Valid!');
        it('"username" Attribute Is Empty!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': null, 'password': self.johnDoe.password}).
                    end(function(err, res) {
                        res.should.have.status(422);
                        res.body.should.have.property('msg').eql('Username: Expected non-empty value!');
                        done();
                    });
            });
        });
        it('"username" Attribute Is Not Valid!');
        it('"Username" Is Wrong!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': self.johnDoe.username + ' Is Wrong!', 'password': self.johnDoe.password}).
                    end(function(err, res) {
                        res.should.have.status(422);
                        res.body.should.have.property('msg').eql('Wrong Username/Email Or Password!');
                        done();
                    });
            });
        });
        it('"Email" Is Wrong!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': self.johnDoe.email + ' Is Wrong!', 'password': self.johnDoe.password}).
                    end(function(err, res) {
                        res.should.have.status(422);
                        res.body.should.have.property('msg').eql('Wrong Username/Email Or Password!');
                        done();
                    });
            });
        });
        it('"Password" Is Wrong!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': self.johnDoe.username, 'password': self.johnDoe.password + ' Is Wrong!'}).
                    end(function(err, res) {
                        res.should.have.status(422);
                        res.body.should.have.property('msg').eql('Wrong Username/Email Or Password!');
                        done();
                    });
            });
        });
    });
    describe('Success!', function () {
        it('User Entered Valid Data (Email)!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': self.johnDoe.email, 'password': self.johnDoe.password}).
                    end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('msg').eql('Sign In Is Successful!');
                        done();
                    });
            });
        });
        it('User Entered Valid Data (Email Has Upper Case)!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': self.johnDoe.email.toUpperCase(), 'password': self.johnDoe.password}).
                    end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('msg').eql('Sign In Is Successful!');
                        done();
                    });
            });
        });
        it('User Entered Valid Data (Email Has Space)!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': '  ' + self.johnDoe.email + '  ', 'password': self.johnDoe.password}).
                    end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('msg').eql('Sign In Is Successful!');
                        done();
                    });
            });
        });
        it('User Entered Valid Data (Username)!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': self.johnDoe.username, 'password': self.johnDoe.password}).
                    end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('msg').eql('Sign In Is Successful!');
                        done();
                    });
            });
        });
        it('User Entered Valid Data (Username Has Upper Case)!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': self.johnDoe.username.toUpperCase(), 'password': self.johnDoe.password}).
                    end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('msg').eql('Sign In Is Successful!');
                        done();
                    });
            });
        });
        it('User Entered Valid Data (Username Has Space)!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': '  ' + self.johnDoe.username + '  ', 'password': self.johnDoe.password}).
                    end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('msg').eql('Sign In Is Successful!');
                        done();
                    });
            });
        });
        it('Token Is Sent After Signning In!', function(done) {
            var self = this;
            User.create(this.johnDoe, function(err) {
                chai.request(app).
                    post(path).
                    send({'username': self.johnDoe.username, 'password': self.johnDoe.password}).
                    end(function(err, res) {
                        res.body.should.have.property('token');
                        done();
                    });
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