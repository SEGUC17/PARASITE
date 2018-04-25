/* eslint max-len: ["error", 100] */

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
var mockgoose = new Mockgoose(mongoose);
var should = chai.should();
// --- End of "Dependancies" --- //

// --- Middleware --- //
chai.use(chaiHttp);
// --- End of "Middleware" --- //

describe('getUserData', function () {

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
            email: 'johndoe@gmail.com',
            firstName: 'John',
            isEmailVerified: true,
            isTeacher: true,
            lastName: 'Doe',
            password: 'JohnPasSWorD',
            phone: '123',
            username: 'john'
        };
        this.token = '';
        this.userDataColumns = [
            'email',
            'firstName',
            'lastName',
            'username'
        ];
        mockgoose.helper.reset().then(function () {
            User.create(that.johnDoe, function (err) {
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

                        that.token = res.body.token;

                        return done();
                    });
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
                if (err) {
                    return done(err);
                }

                res.should.have.status(401);
                res.body.should.have.property('msg').
                    eql('User Is Not Signed In!');

                return done();
            });
    });
    it('Request "body" Is Empty!', function (done) {
        this.userDataColumns = [];
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Request Body: Expected non-empty value!');

                return done();
            });
    });
    it('Request "body" Is Not Valid!', function (done) {
        this.userDataColumns = null;
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.have.property('msg').
                    eql('Request Body: Expected array value!');

                return done();
            });
    });
    it('Request "body" Element(s) Is/Are Not Valid!', function (done) {
        this.userDataColumns.push(123);
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(422);
                res.body.should.property('msg').
                    eql('Request Body Element(s): Expected string value!');

                return done();
            });
    });
    it('Data Retrieval Is Successful!', function (done) {
        var that = this;
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(200);
                res.body.should.have.property('data');
                for (
                    var index = 0;
                    index < that.userDataColumns.length;
                    index += 1
                ) {
                    res.body.data.should.have.property(that.userDataColumns[index]).
                        eql(that.johnDoe[that.userDataColumns[index]]);
                }

                return done();
            });
    });
    it('Requested Column(s) Is/Are Not Valid!', function (done) {
        var that = this;
        this.userDataColumns.push('wrongColumn');
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.not.have.property('wrongColumn');
                for (
                    var index = 0;
                    index < that.userDataColumns.length;
                    index += 1
                ) {
                    if (that.userDataColumns[index] !== 'wrongColumn') {
                        res.body.data.should.have.property(that.userDataColumns[index]).
                            eql(that.johnDoe[that.userDataColumns[index]]);
                    }
                }

                return done();
            });
    });
    it('"password" Attribute Is Requested!', function (done) {
        var that = this;
        this.userDataColumns.push('password');
        chai.request(app).
            post(path).
            send(this.userDataColumns).
            set('Authorization', this.token).
            end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.not.have.property('password');
                for (
                    var index = 0;
                    index < that.userDataColumns.length;
                    index += 1
                ) {
                    if (that.userDataColumns[index] !== 'password') {
                        res.body.data.should.have.property(that.userDataColumns[index]).
                            eql(that.johnDoe[that.userDataColumns[index]]);
                    }
                }

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
