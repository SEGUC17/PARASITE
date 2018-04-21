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

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

describe('psychologist sends a request to edit his/her info', function () {
    var psycho = null;
    var request = null;
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

    beforeEach(function (done) {

        /* create a psychologist to edit */
        mockgoose.helper.reset().then(function () {
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

            /* create an edit request for this psych */
            request = {
                address: 'here',
                createdAt: '1/1/2018',
                daysOff:
                    [
                        'sat',
                        'sun'
                    ],
                editID: psycho._id,
                email: 'new_email@edited.com',
                firstName: 'mariam',
                lastName: 'mahran',
                phone: '010101',
                priceRange: 1000,
                type: 'edit'
                };
                done();
            });
        });
    });

    /* End of "Clearing Mockgoose" */

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

        /* sign up  to the system */
        beforeEach(function (done) {
            chai.request(server).post('/api/signUp').
                send(usr).
                end(function (err1, response) {
                    if (err1) {
                        console.log(err1);
                    }
                    token = response.body.token;

                    /* changing user's type to be an admin */

                    response.should.have.status(201);
                    users.updateOne({ username: 'marioma' }, { $set: { isAdmin: true } }, function (err2) {
                        if (err2) {
                            console.log(err2);
                        }
                    });
                    done();
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
                    res.body.data.nModified.should.be.equal(1);
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


