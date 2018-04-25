/* eslint-disable max-len */
/* eslint-disable max-statements */

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var server = require('../../app');
var Psychologist = mongoose.model('Psychologist');
var users = mongoose.model('User');
var expect = require('chai').expect;
var should = chai.should();
var User = mongoose.model('User');

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

/* a user for signing in*/
var usr = new User({
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
var token = null;

describe('psychologist sends a request to edit his/her info', function () {
    var psycho = null;
    var request = null;

    /* preparing Mockooge */
    before(function (done) {
    mockgoose.prepareStorage().then(function () {
        mongoose.connect(config.MONGO_URI, function () {
            done();
        });
    });
    });

    /* Mockgoose is ready */

    /* Clearing Mockgoose, adding psych and signing */
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            // Psychologist
            Psychologist.create({
                address: 'here',
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
                }, function (err, req) {
                if (err) {
                    console.log(err);
                }
                psycho = req;
                // Request to edit phone and Price Range
                request = {
                    address: 'here',
                    daysOff:
                        [
                            'sat',
                            'sun'
                        ],
                    editID: psycho._id,
                    email: 'blah@blah.com',
                    firstName: 'mariam',
                    lastName: 'mahran',
                    phone: '0188888',
                    priceRange: 1500,
                    type: 'edit'
                    };
                done();
                });
            });
        });

    describe('no Admin users send a request to edit', function() {
        it('send a request to edit the information', function (done) {
            chai.request(server).post('/api/psychologist/request/edit').
                send(request).
                end(function (err, res) {
                    if (err) {
                        return console.log(err);
                    }
                    res.should.have.status(200);
                    res.body.msg.should.be.equal('Request was created successfully.');
                    done();
                });
        });
    });

    describe('Admin can edit directly', function() {

        /* Clearing Mockgoose, adding psych and signing */
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            usr.save(function (err1) {
                if (err1) {
                    throw err1;
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

        it('If Admin, psychologist is edited directly', function (done) {
            chai.request(server).post('/api/psychologist/request/edit').
                set('Authorization', token).
                send(request).
                end(function (err, res) {
                    if (err) {
                        return console.log(err);
                    }
                    res.should.have.status(201);
                    res.body.msg.should.be.equal('Psychologist updated successfully.');
                    res.body.data.ok.should.be.equal(1);
                    done();
                });
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


