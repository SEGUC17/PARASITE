/* eslint-disable sort-keys */
/* eslint-disable guard-for-in */
/*eslint max-statements: ["error", 20]*/
/* eslint multiline-comment-style: ["error", "starred-block"] */

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var Activity = mongoose.model('Activity');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
// --- End of 'Requirements' --- //

// --- Dependancies --- //
var expect = chai.expect;
var mockgoose = new Mockgoose(mongoose);
// --- End of 'Dependancies' --- //

// --- Middleware --- //
chai.use(chaiHttp);
// --- End of 'Middleware' --- //

// Objects variables for testing
var adminUser = null;
var normalUser = null;
var verifiedUser = null;
// Body to be added in POST request
var activityBody = {};

describe('Create Activities', function () {

    /*
     * Tests for POST Activity
     *
     * Only verified contributors and admins can create an
     * activity.
     * Admins' activities should have status=verified
     * right away while verified contributors will have
     * their status=pending until an admin reviews it.
     *
     * @author: Wessam
     */

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {

                done();
            });
        });
    });
    // --- End of 'Mockgoose Initiation' --- //


    // --- Clearing Mockgoose --- //
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            // Creating data for testing
            User.create({
                birthdate: Date.now(),
                email: 'test0@email.com',
                firstName: 'firstname',
                verified: true,
                lastName: 'lastname',
                password: 'password',
                phone: '0111111111',
                username: 'verifiedusername'
            }, function (err, user) {
                if (err) {
                    console.log(err);
                }
                verifiedUser = user;
                User.create({
                    birthdate: Date.now(),
                    email: 'test1@email.com',
                    firstName: 'firstname',
                    lastName: 'lastname',
                    password: 'password',
                    phone: '0111111111',
                    username: 'normalusername'
                }, function (err2, user2) {
                    if (err2) {
                        console.log(err2);
                    }
                    normalUser = user2;
                    User.create({
                        birthdate: Date.now(),
                        email: 'test2@email.com',
                        firstName: 'firstname',
                        isAdmin: true,
                        lastName: 'lastname',
                        password: 'password',
                        phone: '0111111111',
                        username: 'adminusername'
                    }, function (err3, user3) {
                        if (err) {
                            console.log(err3);
                        }
                        adminUser = user3;
                        done();
                    });
                });
            });
            activityBody = {
                name: 'activityName',
                price: 50,
                fromDateTime: Date.now(),
                toDateTime: Date.now() + 5
            };
        });
    });
    // --- End of 'Clearing Mockgoose' --- //

    describe('/POST activities', function () {
        it('it should POST activity with status pending', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': verifiedUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).post('/api/activities').
                send(activityBody).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    Activity.findOne({}, function (err2, activity) {
                        if (err2) {
                            console.log(err2);
                        }
                        expect(activity.status).to.equal('pending');
                        done();
                    });
                });
        });

        it('it should POST activity with status verified', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).post('/api/activities').
                send(activityBody).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    Activity.findOne({}, function (err2, activity) {
                        if (err2) {
                            console.log(err2);
                        }
                        expect(activity.status).to.equal('verified');
                        done();
                    });
                });
        });

        it(
            'it should return 403 nonAdmin and not verified user',
            function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).post('/api/activities').
                send(activityBody).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(403);
                    done();
                });
            }
        );

        it('it should return 401 for unauthenticated user', function (done) {
            chai.request(app).post('/api/activities').
                send(activityBody).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(401);
                    done();
                });
        });


        it('it should return 422 for missing name', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            activityBody.name = null;
            chai.request(app).post('/api/activities').
                send(activityBody).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(422);
                    done();
                });
        });

        it('it should return 422 for wrong date type', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            activityBody.fromDateTime = '12/12/2018';
            chai.request(app).post('/api/activities').
                send(activityBody).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(422);
                    done();
                });
        });
    });
    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
});
