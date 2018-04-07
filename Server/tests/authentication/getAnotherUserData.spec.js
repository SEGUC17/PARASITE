/* eslint-disable max-statements */

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
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
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    // --- Tests --- //
    describe('Failure', function () {
        it('User Is Not Signed In!');
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
