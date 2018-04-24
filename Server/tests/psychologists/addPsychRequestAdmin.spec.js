/* eslint-disable max-len */
/* eslint-disable max-statements */

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var server = require('../../app');
var users = mongoose.model('User');
var expect = require('chai').expect;
var should = chai.should();
var User = mongoose.model('User');

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

/* a user for signing in as an admin */
var user = new User({
    address: 'somewhere',
    birthdate: '1/1/1997',
    email: 'mariam@m.com',
    firstName: 'mariam',
    isAdmin: true,
    isEmailVerified: true,
    lastName: 'mahran',
    password: '12345678',
    phone: '01035044431',
    username: 'marioma'
});

/* user's token */
var token = null;

describe('add psychologist information directly by admin', function () {

    /* preparing Mockooge */
    before(function (done) {
    mockgoose.prepareStorage().then(function () {
        mongoose.connect(config.MONGO_URI, function () {
            done();
        });
    });
    });

    /* Mockgoose is ready */

    /* Clearing Mockgoose */
    beforeEach(function (done) {
    mockgoose.helper.reset().then(function () {
        done();
    });
    });

    /* End of "Clearing Mockgoose" */

    /* sign in to the system */
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            user.save(function (err) {
                if (err) {
                    throw err;
                }
                chai.request(server).
                    post('/api/signIn').
                    send({
                        'password': '12345678',
                        'username': 'marioma'
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
    it('add information directly to address book', function (done) {
        // The Request to be tested:
        var req = {
            address: 'here',
            createdAt: '1/1/2018',
            daysOff:
                [
                    'sat',
                    'sun'
                ],
            email: 'blah@blah.com',
            firstName: 'mariam',
            lastName: 'mahran',
            phone: '010101',
            priceRange: 1000
        };
        chai.request(server).post('/api/psychologist/request/add/addRequest').
            send(req).
            set('Authorization', token).
            end(function (err, res) {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(201);
                res.body.msg.should.be.equal('Psychologist added successfully.');
                done();
            });
    });

    /* Mockgoose Termination */
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });

    /* End of "Mockgoose Termination" */
});

