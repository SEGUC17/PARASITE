/* eslint-disable */

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
var expect = chai.expect;
var should = chai.should();
var mockgoose = new Mockgoose(mongoose);
// --- End of "Dependancies" --- //

// --- Middleware --- //
chai.use(chaiHttp);
// --- End of "Middleware" --- //

describe('isUserExist', function () {

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
        var self = this;
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
            User.create(self.johnDoe, function(err) {
                done();
            });
        });
    });
    // --- End of "Clearing Mockgoose" --- //
    it('Requested "Username" Is Not In DB!', function(done) {
        chai.request(app).
            get(path + this.janeDoe.username).
            end(function(err, res) {
                res.should.have.status(404);
                res.body.should.have.property('msg').eql('User Not Found!');
                done();
            });
    });
    it('Requested "Email" Is Not In DB!', function(done) {
        chai.request(app).
            get(path + this.janeDoe.email).
            end(function(err, res) {
                res.should.have.status(404);
                res.body.should.have.property('msg').eql('User Not Found!');
                done();
            });
    });
    it('Requested "Username" Is In DB!', function(done) {
        chai.request(app).
            get(path + this.johnDoe.username).
            end(function(err, res) {
                res.should.have.status(409);
                res.body.should.have.property('msg').eql('User Found!');
                done();
            });
    });
    it('Requested "Username" Is In DB (Username Has Upper Case)!', function(done) {
        chai.request(app).
            get(path + this.johnDoe.username.toUpperCase()).
            end(function(err, res) {
                res.should.have.status(409);
                res.body.should.have.property('msg').eql('User Found!');
                done();
            });
    });
    it('Requested "Username" Is In DB (Username Has Space)!', function(done) {
        chai.request(app).
            get(path + '  ' + this.johnDoe.username + '  ').
            end(function(err, res) {
                res.should.have.status(409);
                res.body.should.have.property('msg').eql('User Found!');
                done();
            });
    });
    it('Requested "Email" Is In DB!', function(done) {
        chai.request(app).
            get(path + this.johnDoe.email).
            end(function(err, res) {
                res.should.have.status(409);
                res.body.should.have.property('msg').eql('User Found!');
                done();
            });
    });
    it('Requested "Email" Is In DB (Email Has Upper Case)!', function(done) {
        chai.request(app).
            get(path + this.johnDoe.email.toUpperCase()).
            end(function(err, res) {
                res.should.have.status(409);
                res.body.should.have.property('msg').eql('User Found!');
                done();
            });
    });
    it('Requested "Email" Is In DB (Email Has Space)!');
    // --- End of "Tests" --- //

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //

});
