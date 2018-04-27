/* eslint-disable max-len */
/* eslint-disable max-statements */
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var prodRequests = mongoose.model('ProductRequest');
var User = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

// user for authentication
var user = new User({
    birthdate: '1/1/1980',
    email: 'omar@omar.omar',
    firstName: 'Omar',
    isAdmin: true,
    isEmailVerified: true,
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
});

var userNonAdmin = new User({
    birthdate: '1/1/1980',
    email: 'omar@omar.omar',
    firstName: 'Omar',
    isAdmin: false,
    isEmailVerified: true,
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
});

// Test request
var prodReqTest = new prodRequests({
    acquiringType: 'sell',
    createdAt: new Date(),
    description: 'blah blah blah',
    name: 'someProdRequest',
    price: 150,
    seller: 'omar'
});

var prodReqTestAcc = new prodRequests({
    acquiringType: 'sell',
    createdAt: new Date(),
    description: 'blah blah blah',
    name: 'someProdRequest',
    price: 150,
    seller: 'omar'
});

// authenticated token
var token = null;

// Testing the cases of evaluating as an admin
describe('EvaluateProdRequestByAdmin', function () {

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                mockgoose.helper.reset().then(function () {
                    user.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        chai.request(server).
                            post('/api/signIn').
                            send({
                                'password': '123456789',
                                'username': 'omar'
                            }).
                            end(function (err2, response) {
                                if (err2) {
                                    return console.log(err2);
                                }
                                response.should.have.status(200);
                                token = response.body.token;
                                done();
                            });
                    });
                });
            });
        });
    });
    // --- End of "Mockgoose Initiation" --- //

    it('Request should be accepted', function (done) {
        prodReqTestAcc.save(function (err) {
            if (err) {
                return console.log(err);
            }

            var acceptedReq = {
                _id: prodReqTestAcc._id,
                acquiringType: 'sell',
                createdAt: new Date(),
                description: 'blah blah blah',
                name: 'someProdRequest',
                price: 150,
                result: true,
                seller: 'omar'
            };

            chai.request(server).
                post('/api/productrequest/evaluateRequest').
                send(acceptedReq).
                set('Authorization', token).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(201);
                    res.body.msg.should.be.equal('Request accepted and product added to database.');
                    done();
                });
        });
    });

    it('Request should be rejected', function (done) {
        var rejectedReq = {
            _id: prodReqTest._id,
            acquiringType: 'sell',
            createdAt: new Date(),
            description: 'blah blah blah',
            name: 'someProdRequest',
            price: 150,
            result: false,
            seller: 'omar'
        };

        chai.request(server).
            post('/api/productrequest/evaluateRequest').
            send(rejectedReq).
            set('Authorization', token).
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                expect(res).to.have.status(200);
                res.body.msg.should.be.equal('Request rejected and user notified.');
                done();
            });
    });

    it('Request result was true but not found.(404)', function (done) {
        prodReqTest.result = true;

        chai.request(server).
            post('/api/productrequest/evaluateRequest').
            send({ _id: '2930ri2390ri3934t8' }).
            set('Authorization', token).
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                expect(res).to.have.status(404);
                res.body.msg.should.be.equal('Request not found.');
                done();
            });
    });

    it('Request result was false but not found.(404)', function (done) {
        prodReqTest.result = false;

        chai.request(server).
            post('/api/productrequest/evaluateRequest').
            send({ _id: '2930ri2390ri3934t8' }).
            set('Authorization', token).
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                expect(res).to.have.status(404);
                res.body.msg.should.be.equal('Request not found.');
                done();
            });
    });

    // --- Mockgoose Termination --- //
    after(function (done) {
        mockgoose.helper.reset().then(function () {
            mongoose.connection.close(function () {
                done();
            });
        });
    });
    // --- End of "Mockgoose Termination" --- //
});

// Testing for no-user and non-admin case
describe('EvaluateProdRequestByNonAdmin', function () {

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                mockgoose.helper.reset().then(function () {
                    userNonAdmin.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        chai.request(server).
                            post('/api/signIn').
                            send({
                                'password': '123456789',
                                'username': 'omar'
                            }).
                            end(function (err2, response) {
                                if (err2) {
                                    return console.log(err2);
                                }
                                response.should.have.status(200);
                                token = response.body.token;
                                done();
                            });
                    });
                });
            });
        });
    });
    // --- End of "Mockgoose Initiation" --- //

    it('Request should NOT be evaluated', function (done) {
        prodReqTest.save(function (err) {
            if (err) {
                return console.log(err);
            }

            prodReqTest.result = true;

            chai.request(server).
                post('/api/productrequest/evaluateRequest').
                send(prodReqTest).
                set('Authorization', token).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(403);
                    res.body.err.should.be.equal('You are not an admin OR you are not signed in');
                    done();
                });
        });
    });
    // --- Mockgoose Termination --- //
    after(function (done) {
        mockgoose.helper.reset().then(function () {
            mongoose.connection.close(function () {
                done();
            });
        });
    });
    // --- End of "Mockgoose Termination" --- //
});
