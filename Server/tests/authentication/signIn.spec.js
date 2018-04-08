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
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    // --- Tests --- //
    describe('Failure', function () {
        it('User Is Already Signed In!');
        it('Token Expires In More Than 12 Hours!');
        it('"password" Attribute Is Empty!');
        it('"password" Attribute Is Not Valid!');
        it('"username" Attribute Is Empty!');
        it('"username" Attribute Is Not Valid!');
        it('"Username" Is Wrong!');
        it('"Email" Is Wrong!');
        it('"Password" Is Wrong!');
    });
    describe('Success!', function () {
        it('User Entered Valid Data (Email)!');
        it('User Entered Valid Data (Email Has Upper Case)!');
        it('User Entered Valid Data (Email Has Space)!');
        it('User Entered Valid Data (Username)!');
        it('User Entered Valid Data (Username Has Upper Case)!');
        it('User Entered Valid Data (Username Has Space)!');
        it('Token Is Sent After Signning In!');
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