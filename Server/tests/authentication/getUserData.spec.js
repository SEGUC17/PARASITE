/* eslint-disable */

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var path = '/api/userData';
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

describe('getUserData', function () {

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
        this.token = '';
        this.userDataColumns = ['email', 'firstName', 'lastName', 'username'];
        var self = this;
        mockgoose.helper.reset().then(function () {
            chai.request(app).
                post('/api/signUp').
                send(self.johnDoe).
                end(function (err, res) {
                    self.token = res.body.token;
                    done();
                });
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    // --- Tests --- //
    it('User Is Not Signed In!', function (done) {
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            end(function (err, res) {
                res.should.have.status(401);
                res.body.should.have.property('msg').eql('User Is Not Signed In!');
                done();
            });
    });
    it('Request "body" Is Empty!', function (done) {
        this.userDataColumns = [];
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                res.should.have.status(422);
                res.body.should.have.property('msg').eql('Request Body: Expected non-empty value!');
                done();
            });
    });
    it('Request "body" Is Not Valid!', function (done) {
        this.userDataColumns = null;
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                res.should.have.status(422);
                res.body.should.have.property('msg').eql('Request Body: Expected array value!');
                done();
            });
    });
    it('Request "body" Element(s) Is/Are Not Valid!', function (done) {
        this.userDataColumns.push(123);
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                res.should.have.status(422);
                res.body.should.property('msg').eql('Request Body Element(s): Expected string value!');
                done();
            });
    });
    it('Data Retrieval Is Successful!', function (done) {
        var self = this;
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property('data');
                for (var index = 0; index < self.userDataColumns.length; index += 1) {
                    res.body.data.should.have.property(self.userDataColumns[index]).eql(self.johnDoe[self.userDataColumns[index]]);
                }
                done();
            });
    });
    it('Requested Column(s) Is/Are Not Valid!', function (done) {
        this.userDataColumns.push('wrongColumn');
        var self = this;
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.not.have.property('wrongColumn');
                for (var index = 0; index < self.userDataColumns.length; index += 1) {
                    if (self.userDataColumns[index] !== 'wrongColumn') {
                        res.body.data.should.have.property(self.userDataColumns[index]).eql(self.johnDoe[self.userDataColumns[index]]);
                    }
                }
                done();
            });
    });
    it('"password" Attribute Is Requested!', function (done) {
        this.userDataColumns.push('password');
        var self = this;
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.not.have.property('password');
                for (var index = 0; index < self.userDataColumns.length; index += 1) {
                    if (self.userDataColumns[index] !== 'password') {
                        res.body.data.should.have.property(self.userDataColumns[index]).eql(self.johnDoe[self.userDataColumns[index]]);
                    }
                }
                done();
            });
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
