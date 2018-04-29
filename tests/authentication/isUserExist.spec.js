/* eslint max-statements: ["error", 10, { "ignoreTopLevelFunctions": true }] */
/* eslint max-len: ["error", 100] */

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var path = '/api/dupCheck/';
var User = require('../../api/models/User');
// --- End of "Requirements" --- //

// --- Dependancies --- //
var mockgoose = new Mockgoose(mongoose);
var should = chai.should();
// --- End of "Dependancies" --- //

// --- Middleware --- //
chai.use(chaiHttp);
// --- End of "Middleware" --- //

describe('isUserExist', function () {

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
        var that = this;
        this.johnDoe = {
            address: 'John Address Sample',
            birthdate: '1/1/1980',
            email: 'johndoe@j.d',
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
            email: 'janedoe@j.d',
            firstName: 'Jane',
            isTeacher: true,
            lastName: 'Doe',
            password: 'JanePasSWorD',
            phone: '123',
            username: 'jane'
        };
        mockgoose.helper.reset().then(function () {
            User.create(that.johnDoe, function (err) {
                if (err) {
                    return done(err);
                }

                return done();
            });
        });
    });
    // --- End of "Clearing Mockgoose" --- //
    it('Requested "Username" Is Not In DB!', function (done) {
        chai.request(app).
            get(path + this.janeDoe.username).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(404);
                res.body.should.have.property('msg').
                    eql('User Not Found!');

                return done();
            });
    });
    it('Requested "Email" Is Not In DB!', function (done) {
        chai.request(app).
            get(path + this.janeDoe.email).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(404);
                res.body.should.have.property('msg').
                    eql('User Not Found!');

                return done();
            });
    });
    it('Requested "Email" Is In DB!', function (done) {
        chai.request(app).
            get(path + this.johnDoe.email).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(409);
                res.body.should.have.property('msg').
                    eql('User Found!');

                return done();
            });
    });
    it('Requested "Email" Is In DB (Email Has Upper Case)!', function (done) {
        chai.request(app).
            get(path + this.johnDoe.email.toUpperCase()).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(409);
                res.body.should.have.property('msg').
                    eql('User Found!');

                return done();
            });
    });
    it('Requested "Email" Is In DB (Email Has Space)!', function (done) {
        chai.request(app).
            get(path + '  ' + this.johnDoe.email + '  ').
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(409);
                res.body.should.have.property('msg').
                    eql('User Found!');

                return done();
            });
    });
    it('Requested "Username" Is In DB!', function (done) {
        chai.request(app).
            get(path + this.johnDoe.username).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(409);
                res.body.should.have.property('msg').
                    eql('User Found!');

                return done();
            });
    });
    it('Requested "Username" Is In DB (Username Has Upper Case)!', function (done) {
        chai.request(app).
            get(path + this.johnDoe.username.toUpperCase()).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(409);
                res.body.should.have.property('msg').
                    eql('User Found!');

                return done();
            });
    });
    it('Requested "Username" Is In DB (Username Has Space)!', function (done) {
        chai.request(app).
            get(path + '  ' + this.johnDoe.username + '  ').
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(409);
                res.body.should.have.property('msg').
                    eql('User Found!');

                return done();
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
