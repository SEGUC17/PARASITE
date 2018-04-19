/* eslint-disable max-len */
/* eslint-disable max-statements */
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var prodRequests = mongoose.model('ProductRequest');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

// user for authentication
var user = {
    birthdate: '1/1/1980',
    email: 'omar@omar.omar',
    firstName: 'Omar',
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
};

// Test request
var prodReqTest = new prodRequests({
    acquiringType: 'sell',
    createdAt: new Date(),
    description: 'blah blah blah',
    name: 'someProdRequest',
    price: 150,
    seller: 'omar'
});


// authenticated token
var token = null;

describe('Retrieving my unevaluated product requests', function () {

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

    it('It should GET my product requests from the server', function (done) {

        //sign up
        chai.request(server).
            post('/api/signUp').
            send(user).
            end(function (err, response) {
                if (err) {
                    return console.log(err);
                }
                response.should.have.status(201);
                token = response.body.token;
                // save your document with a call to save
                prodReqTest.save(function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    chai.request(server).
                        get('/api/productrequest/getUserRequests/' + user.username).
                        set('Authorization', token).
                        end(function (error, res) {
                            if (error) {
                                return console.log(error);
                            }
                            expect(res).to.have.status(200);
                            res.body.msg.should.be.equal('Requests retrieved.');
                            res.body.data.should.be.a('array');
                            res.body.data[0].should.have.
                                property('name', 'someProdRequest', 'request name invalid');
                            res.body.data[0].should.have.property('acquiringType', 'sell', 'Wrong acquiring type');
                            res.body.data[0].should.have.property('description', 'blah blah blah', 'Wrong description');
                            res.body.data[0].should.have.property('price', 150, 'Wrong price');
                            res.body.data[0].should.have.property('seller', 'omar', 'Wrong seller');
                            res.body.data[0].should.have.property('createdAt');
                            done();
                        });
                });
            });
    });

    it('It should NOT GET my product requests from the server because I am not the owner', function (done) {

        //sign up
        chai.request(server).
            post('/api/signUp').
            send(user).
            end(function (err, response) {
                if (err) {
                    return console.log(err);
                }
                response.should.have.status(201);
                token = response.body.token;
                // save your document with a call to save
                prodReqTest.save(function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    chai.request(server).
                        get('/api/productrequest/getUserRequests/dummyuserwhodoesntexist').
                        set('Authorization', token).
                        end(function (error, res) {
                            if (error) {
                                return console.log(error);
                            }
                            expect(res).to.have.status(403);
                            res.body.err.should.be.equal('You can only view your requests');
                            done();
                        });
                });
            });
    });
    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //
});
