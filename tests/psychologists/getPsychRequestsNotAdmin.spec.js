/* eslint-disable max-len */
/* eslint-disable max-statements */
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
// import your schema here, like this:
var psychRequests = mongoose.model('PsychologistRequest');
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
    isEmailVerified: true,
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
});
// authenticated token
var token = null;

describe('GetPsychRequestsNotAdmin', function () {

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

    it('It should NOT GET psychologist requests from the server', function (done) {
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
                    expect(res).to.have.status(403);
                    res.body.err.should.be.equal('You are not an admin to do that');
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
