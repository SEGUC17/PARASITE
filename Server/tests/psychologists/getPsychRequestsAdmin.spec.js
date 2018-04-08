/* eslint-disable max-len */
/* eslint-disable max-statements */
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
// import your schema here, like this:
var psychRequests = mongoose.model('PsychologistRequest');
var users = mongoose.model('User');
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
// authenticated token
var token = null;

describe('GetPsychRequestsAdmin', function () {

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
    it('It should GET psychologist requests from the server', function (done) {
        var psychReqTest = new psychRequests({
            address: 'Some address',
            daysOff: [
                'Sat',
                'Sun'
            ],
            email: 'ahmed@ahmed.com',
            firstName: 'Ahmed',
            lastName: 'Darwish',
            phone: '012412414',
            priceRange: 124
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

                users.updateOne({ username: 'omar' }, { $set: { isAdmin: true } }, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    // save your document with a call to save
                    psychReqTest.save(function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        chai.request(server).
                            get('/api/psychologist/request/getRequests').
                            set('Authorization', token).
                            end(function (error, res) {
                                if (error) {
                                    return console.log(error);
                                }
                                expect(res).to.have.status(200);
                                res.body.msg.should.be.equal('Requests retrieved successfully.');
                                res.body.data.should.be.a('array');
                                res.body.data[0].should.have.
                                    property('firstName', 'Ahmed', 'first name invalid');
                                res.body.data[0].should.have.property('lastName', 'Darwish', 'last name type');
                                res.body.data[0].should.have.property('address', 'Some address', 'Wrong address');
                                res.body.data[0].should.have.property('priceRange', 124, 'Wrong price range');
                                res.body.data[0].should.have.property('phone', '012412414', 'Wrong phone');
                                res.body.data[0].should.have.property('email', 'ahmed@ahmed.com', 'wrong email');
                                res.body.data[0].should.have.property('daysOff').with.lengthOf(2);
                                done();
                            });
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
