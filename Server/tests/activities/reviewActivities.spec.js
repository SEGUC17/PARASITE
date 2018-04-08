/* eslint-disable sort-keys */
/* eslint-disable guard-for-in */
/*eslint max-statements: ["error", 20]*/

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

var adminUser = null;
var normalUser = null;
var pendingActivity = null;

var urlPath = '/api/unverifiedActivities';

describe('Review Activities', function () {
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
            Activity.create({
                creator: 'normalusername',
                name: 'activity1',
                description: 'activity1 des',
                fromDateTime: Date.now(),
                toDateTime: Date.now() + 5,
                status: 'pending',
                price: 50
            }, function (err, activity) {
                if (err) {
                    console.log(err);
                }
                pendingActivity = activity;
            });
            User.create({
                birthdate: Date.now(),
                email: 'test@email.com',
                firstName: 'firstname',
                isAdmin: false,
                lastName: 'lastname',
                password: 'password',
                phone: '0111111111',
                username: 'normalusername'
            }, function (err, user) {
                if (err) {
                    console.log(err);
                }
                normalUser = user;
                User.create({
                    birthdate: Date.now(),
                    email: 'test@email.com',
                    firstName: 'firstname',
                    isAdmin: true,
                    lastName: 'lastname',
                    password: 'password',
                    phone: '0111111111',
                    username: 'adminusername'
                }, function (err2, user2) {
                    if (err2) {
                        console.log(err2);
                    }
                    adminUser = user2;
                    done();
                });
            });
        });
    });
    // --- End of 'Clearing Mockgoose' --- //
    describe('/Review activities', function () {
        it('it activity status should change to verified', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).put(urlPath).
                send({
                    '_id': pendingActivity._id,
                    'status': 'verified'
                }).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(204);
                    Activity.findOne({}, function (err2, activity) {
                        if (err2) {
                            console.log(err2);
                        }
                        expect(activity.status).to.equal('verified');
                        done();
                    });
                });
        });
        it('it should return 403 for nonAdmins', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).put(urlPath).
                send({
                    '_id': pendingActivity._id,
                    'status': 'verified'
                }).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(403);
                    done();
                });
        });
        it('it should return 401 for unAuthenticated users', function (done) {
            chai.request(app).put(urlPath).
                send({
                    '_id': pendingActivity._id,
                    'status': 'verified'
                }).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(401);
                    done();
                });
        });

        it(
            'it should return 422 for missing attributes in body',
            function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).put(urlPath).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(422);
                    done();
                });
            }
        );
        it('it should return 422 for wrong activity _id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).put(urlPath).
                send({
                    '_id': 'wrong_id',
                    'status': 'verified'
                }).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(422);
                    done();
                });
        });
        it('it should return 422 for wrong status', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).put(urlPath).
                send({
                    '_id': pendingActivity._id,
                    'status': 'wrongStatus'
                }).
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
