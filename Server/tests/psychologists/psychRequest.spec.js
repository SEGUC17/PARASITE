/* eslint-disable max-len */
/* eslint-disable max-statements */

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var server = require('../../app');
var users = mongoose.model('User');
var expect = require('chai').expect;

chai.use(chaiHttp);

/* preparing Mockooge */
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

before(function (done) {
    mockgoose.prepareStorage().then(function () {
        mongoose.connect(config.MONGO_URI, function (err) {
            done(err);
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

describe('Send a request to contact info to address book', function () {
    describe('send a request by a reular rgistered/unregistered user', function () {
        it('post a request to add psychologist information', function () {
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
                end(function (err, res) {
                    if (err) {
                        return console.log(err);
                    }
                    res.should.have.status(200);
                });
        });
    });


    describe('add psychologist information directly by admin', function () {

        var usr = {
            address: 'somewhere',
            avatar: '',
            birthdate: '1/1/1997',
            children: [],
            educationLevel: '',
            educationSystem: '',
            email: 'mariam@m.com',
            firstName: 'mariam',
            isAdmin: true,
            isChild: false,
            isParent: false,
            isTeacher: false,
            lastName: 'mahran',
            password: '12345678',
            phone: ['01035044431'],
            schedule: [],
            studyPlans: [],
            username: 'marioma',
            verified: true
        };
        var token = null;

        var authenticatedUser = request.agent(server);
        before(function (done) {
            authenticatedUser.post('/api/signUp').
                send(usr).
                end(function (err, response) {
                    if (err) {
                        console.log(err);
                    }
                    response.should.have.status(201);
                    token = response.body.token;
                    done();
                });
        });
        it('add information directly to address book', function () {
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
            users.updateOne({ username: 'marioma' }, { $set: { isAdmin: true } }, function (err1) {
                if (err1) {
                    console.log(err1);
                }
            });
            authenticatedUser.post('/api/psychologist/request/add/addRequest').
                send(req).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        return console.log(err);
                    }
                    res.should.have.status(200);
                });
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
