/* eslint-disable */

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var path = '/api/userData/';
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

describe('getAnotherUserData', function () {

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
        this.token = '';
        this.userDataColumns = ['email', 'firstName', 'lastName', 'username'];
        var self = this;
        mockgoose.helper.reset().then(function () {
            chai.request(app).
                post('/api/signUp').
                send(self.johnDoe).
                end(function (err, res) {
                    self.token = res.body.token;
                    User.create(self.janeDoe, function (err2) {
                        done();
                    });
                });
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    // --- Tests --- //
    describe('Failure', function () {
        it('User Is Not Signed In!', function (done) {
            chai.request(app).
                post(path + this.janeDoe.username).
                send(this.userDataColumns).
                end(function(err, res) {
                    res.should.have.status(401);
                    res.body.should.have.property('msg').eql('User Is Not Signed In!');
                    done();
                });
        });
        it('Request "body" Is Empty!');
        it('Request "body" Is Not Valid!');
        it('Requested "Username" Is Not In DB!');
        it('Requested "Email" Is Not In DB!');
        it('Request "body" Element(s) Is/Are Not Valid!');
    });
    describe('Success!', function () {
        it('Data Retrieval Is Successful!');
        it('Requested Column(s) Is/Are Not Valid!');
        it('"password" Attribute Is Requested!');
        it('"Non-Admin" Requesting "schdule"!');
        it('"Non-Admin" Requesting "studyPlans"!');
        it('"Non-Parent" Requesting "schdule"!');
        it('"Non-Parent" Requesting "studyPlans"!');
        it('"Admin" Requesting "schdule"!');
        it('"Admin" Requesting "studyPlans"!');
        it('"Parent" Requesting "schdule"!');
        it('"Parent" Requesting "studyPlans"!');
        it('"Owner" Requesting "schdule"!');
        it('"Owner" Requesting "studyPlans"!');
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
