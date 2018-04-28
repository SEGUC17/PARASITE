/* eslint-disable max-len */
/* eslint-disable max-statements */
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var prodRequests = mongoose.model('ProductRequest');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var User = mongoose.model('User');
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
    isEmailVerified: true,
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
});

// Test request
var prodReqTest = new prodRequests({
    acquiringType: 'sell',
    description: 'blah blah blah',
    name: 'someProdRequest',
    price: 150,
    seller: 'omar'
});

var otherProd = {
    acquiringType: 'sell',
    description: 'blah blah blah',
    name: 'someProdRequest',
    price: 150,
    seller: 'omar'
};

var updatedStuff = {
    description: 'updated desc',
    name: 'updated name',
    price: 666,
    seller: 'someotherguy'
};

// authenticated token
var token = null;

describe('Editing product requests', function () {

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                mockgoose.helper.reset().then(function () {
                    user.save(function (error) {
                        if (error) {
                            throw error;
                        }

                        //sign in
                        chai.request(server).
                            post('/api/signIn').
                            send({
                                'password': '123456789',
                                'username': 'omar'
                            }).
                            end(function (err, response) {
                                if (err) {
                                    return console.log(err);
                                }
                                expect(response).to.have.status(200);
                                token = response.body.token;
                                // save your document with a call to save
                                done();
                            });
                    });
                });
            });
        });
    });
    // --- End of "Mockgoose Initiation" --- //

    it('I should receive an error if I do edit others requests', function (done) {
        prodReqTest.save(function (err, savedReq) {
            if (err) {
                return console.log(err);
            }
            chai.request(server).
                patch('/api/productrequest/updateProdRequest/' + savedReq._id + '/someIdiotUser').
                set('Authorization', token).
                send(updatedStuff).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(403);
                    res.body.err.should.be.equal('You can only edit your requests');
                    done();
                });
        });
    });

    it('It should update MY product requests', function (done) {

        prodRequests.create(otherProd, function (err, savedReq) {
            if (err) {
                return console.log(err);
            }
            chai.request(server).
                patch('/api/productrequest/updateProdRequest/' + savedReq._id + '/' + user.username).
                set('Authorization', token).
                send(updatedStuff).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(201);
                    res.body.msg.should.be.equal('Request updated.');
                    prodRequests.find({}, function (err, Requests) {
                        if (err) {
                            return console.log(err);
                        }
                        Requests.should.be.a('array');
                        Requests[1].should.have.property('name', 'updated name', 'request name invalid');
                        Requests[1].should.have.property('description', 'updated desc', 'Wrong description');
                        Requests[1].should.have.property('price', 666, 'Wrong price');
                        Requests[1].should.have.property('seller', 'omar', 'Seller is changed');
                        done();
                    });
                });
        });
    });

    // --- Clearing Mockgoose --- //
    after(function (done) {
        mockgoose.helper.reset().then(function () {
            mongoose.connection.close(function () {
                done();
            });
        });
    });
    // --- End of "Clearing Mockgoose" --- //
});
