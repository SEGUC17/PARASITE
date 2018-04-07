/* eslint-disable max-len */
/* eslint-disable max-statements */
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
// import your schema here, like this:
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
    firstName: 'omar',
    isAdmin: true,
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
};
// authenticated token
var token = null;

describe('GetProdRequests', function () {
    this.timeout(120000);

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
    it('It should GET product requests from the server', function (done) {
        var prodReqTest = new prodRequests({
            acquiringType: 'sell',
            createdAt: new Date(),
            description: 'blah blah blah',
            name: 'someProdRequest',
            price: 150,
            seller: 'omar'
        });

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

                // save your document with a call to save, cat1 is just the variable name here
                prodReqTest.save(function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    // write your actual test here, like this:
                    chai.request(server).get('/api/productrequest/getRequests').
                        end(function (error, res) {
                            if (error) {
                                return console.log(error);
                            }
                            expect(res).to.have.status(200);
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
    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //
});
