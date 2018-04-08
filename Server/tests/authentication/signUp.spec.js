/* eslint-disable */

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JWTStrategy = require('passport-jwt').Strategy;
var path = '/api/signUp';
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

// --- Variables Needed In Testing --- //
var johnDoe = new User({
    address: 'John Address Sample',
    birthdate: '1/1/1980',
    email: 'johndoe@gmail.com',
    firstName: 'John',
    isTeacher: true,
    lastName: 'Doe',
    password: 'JohnPasSWorD',
    phone: '123',
    username: 'john'
});
var janeDoe = new User({
    address: 'Jane Address Sample',
    birthdate: '1/1/2000',
    email: 'janedoe@gmail.com',
    firstName: 'Jane',
    isTeacher: true,
    lastName: 'Doe',
    password: 'JanePasSWorD',
    phone: '123',
    username: 'jane'
});
// --- End of "Variables Needed In Testing" --- //

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
                send(johnDoe).
                end(function (err, res) {
                    token = res.body.token;
                    chai.request(app).
                        post(path).
                        send(janeDoe).
                        set('Authorization', res.body.token).
                        end(function (err2, res2) {
                            res2.should.have.status(403);
                            res2.body.should.have.property('msg').eql('User Is Already Signed In!');
                            done();
                        })
                });
            done();
        });
        it('Token Expires In More Than 12 Hours!');
        it('"address" Attribute Is Not Valid!');
        it('"birthdate" Attribute Is Empty!');
        it('"birthdate" Attribute Is Not Valid!');
        it('"email" Attribute Is Empty!');
        it('"email" Attribute Is Not Valid!');
        it('"firstName" Attribute Is Empty!');
        it('"firstName" Attribute Is Not Valid!');
        it('"isTeacher" Attribute Is Empty!');
        it('"isTeacher" Attribute Is Not Valid!');
        it('"lastName" Attribute Is Empty!');
        it('"lastName" Attribute Is Not Valid!');
        it('"password" Attribute Is Empty!');
        it('"password" Attribute Is Not Valid!');
        it('"phone" Attribute Is Not Valid!');
        it('"phone" Attribute Element(s) Is/Are Not Valid');
        it('"username" Attribute Is Empty!');
        it('"username" Attribute Is Not Valid!');
        it('"Age" Is Less Than 13!');
        it('"Email" Is Not Valid!');
        it('"Password" Has Length Less Than 8');
        it('"Phone" Element(s) Is/Are Not Valid!');
        it('"Email" Is A Duplicate!');
        it('"Username" Is A Duplicate!');
    });
    describe('Success!', function () {
        it('User Entered Valid Data!');
        it('"Address" Is Lowered Case!');
        it('"Email" Is Lowered Case!');
        it('"Email" Is Trimmed!');
        it('"Username" Is Lowered Case!');
        it('"Username" Is Trimmed!');
        it('Password Is Hashed!');
        it('Token Is Sent After Signning Up!');
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
