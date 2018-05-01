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
var childUser = null;
var parentUser = null;
var normalUser = null;
var bookingUser = null;
var pendingActivity = null;
var verifiedActivity = null;

describe('Activities Booking', function () {

    /*
     * Tests for booking activities
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
            Activity.create({
                creator: 'username',
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
            Activity.create({
                creator: 'username',
                name: 'activity3',
                description: 'activity3 des',
                fromDateTime: Date.now(),
                toDateTime: Date.now() + 5,
                status: 'verified',
                bookedBy: ['bookingusername'],
                price: 50
            }, function (err, activity) {
                if (err) {
                    console.log(err);
                }
                verifiedActivity = activity;
            });
            User.create({
                birthdate: Date.now(),
                email: 'test0@email.com',
                firstName: 'firstname',
                lastName: 'lastname',
                password: 'password',
                phone: '0111111111',
                isChild: true,
                username: 'childUsername'
            }, function (err, user) {
                if (err) {
                    console.log(err);
                }
                childUser = user;
                User.create({
                    birthdate: Date.now(),
                    email: 'test1@email.com',
                    firstName: 'firstname',
                    lastName: 'lastname',
                    password: 'password',
                    phone: '0111111111',
                    isParent: true,
                    children: ['childusername'],
                    username: 'parentUsername'
                }, function (err2, user2) {
                    if (err) {
                        console.log(err2);
                    }
                    parentUser = user2;
                    User.create({
                        birthdate: Date.now(),
                        email: 'test1@email.com',
                        firstName: 'firstname',
                        lastName: 'lastname',
                        password: 'password',
                        phone: '0111111111',
                        username: 'normalUsername'
                    }, function(err3, user3) {
                        if (err3) {
                            console.log(err3);
                        }
                        normalUser = user3;
                        User.create({
                            birthdate: Date.now(),
                            email: 'test1@email.com',
                            firstName: 'firstname',
                            lastName: 'lastname',
                            password: 'password',
                            phone: '0111111111',
                            username: 'bookingUsername'
                        }, function (err4, user4) {
                            if (err4) {
                                console.log(err4);
                            }
                            bookingUser = user4;
                            done();
                        });
                    });
                });
            });
        });
    });
    // --- End of 'Clearing Mockgoose' --- //

    describe('/Book Activity', function () {

        /*
         * Tests for Commenting on activities
         *
         * @author: Wessam
         */
        it('it should book activity for self', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': parentUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).post('/api/activities/' +
                verifiedActivity._id + '/book/').
                send({ username: parentUser.username }).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    Activity.findOne(
                        { _id: verifiedActivity._id },
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.bookedBy.
                                indexOf(parentUser.username)).
                                to.not.equal(-1);
                            done();
                        }
                    );
                });
        });
        it('it should book activity for child', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': parentUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).post('/api/activities/' +
                verifiedActivity._id + '/book/').
                send({ username: childUser.username }).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    Activity.findOne(
                        { _id: verifiedActivity._id },
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.bookedBy.
                                indexOf(childUser.username)).
                                to.not.equal(-1);
                            done();
                        }
                    );
                });
        });
        it(
            'it should return 403 for booking a pending activity',
            function (done) {
                var token = 'JWT ' + jwt.sign(
                    { 'id': parentUser._id },
                    config.SECRET,
                    { expiresIn: '12h' }
                );
                chai.request(app).post('/api/activities/' +
                    pendingActivity._id + '/book/').
                    send({ username: parentUser.username }).
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
        it('it should return 404 for wrong activity id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': parentUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).post('/api/activities/' +
                childUser._id + '/book/').
                send({ username: childUser.username }).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should return 403 for booking for non Child', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': parentUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).post('/api/activities/' +
                verifiedActivity._id + '/book/').
                send({ username: normalUser.username }).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(403);
                    done();
                });
        });
        it('it should return 400 for already booked', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': bookingUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).post('/api/activities/' +
                verifiedActivity._id + '/book/').
                send({ username: bookingUser.username }).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(400);
                    done();
                });
        });
    });
    // --- Clearing Mockgoose --- //
    after(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
});
