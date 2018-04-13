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
var normalUser = null;
var adminUser = null;
var rejectedActivity = null;
var creatorUser = null;
var pendingActivity = null;
var verifiedActivity = null;

describe('Activities Comments viewing', function () {

    /*
     * Tests for GET Activity both list and detail
     *
     * All users can view a verified activity in list or in detail
     * While pending and rejected activities can be viewed by admin
     * in list and in detail and their creator in detail only.
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
                discussion: [
                    {
                        creator: 'dummyUser',
                        text: 'comment text',
                        replies: [
                            {
                                creator: 'dummyUser',
                                text: 'reply text'
                            }
                        ]
                    },
                    {
                        creator: 'dummyUser',
                        text: 'comment text2',
                        replies: [
                            {
                                creator: 'dummyUser',
                                text: 'reply1 text2'
                            },
                            {
                                creator: 'dummyUser',
                                text: 'reply2 text2'
                            }
                        ]
                    },
                    {
                        creator: 'dummyUser',
                        text: 'comment text3',
                        replies: [
                            {
                                creator: 'dummyUser',
                                text: 'reply text3'
                            }
                        ]
                    }
                ],
                price: 50
            }, function (err, activity) {
                if (err) {
                    console.log(err);
                }
                pendingActivity = activity;
            });
            Activity.create({
                creator: 'username',
                name: 'activity2',
                description: 'activity2 des',
                fromDateTime: Date.now(),
                toDateTime: Date.now() + 5,
                status: 'rejected',
                price: 50
            }, function (err, activity) {
                if (err) {
                    console.log(err);
                }
                rejectedActivity = activity;
            });
            Activity.create({
                creator: 'username',
                name: 'activity3',
                description: 'activity3 des',
                fromDateTime: Date.now(),
                toDateTime: Date.now() + 5,
                status: 'verified',
                discussion: [
                    {
                        creator: 'dummyUser',
                        text: 'comment text',
                        replies: [
                            {
                                creator: 'dummyUser',
                                text: 'reply text'
                            }
                        ]
                    },
                    {
                        creator: 'dummyUser',
                        text: 'comment text2',
                        replies: [
                            {
                                creator: 'dummyUser',
                                text: 'reply1 text2'
                            },
                            {
                                creator: 'dummyUser',
                                text: 'reply2 text2'
                            }
                        ]
                    },
                    {
                        creator: 'dummyUser',
                        text: 'comment text3',
                        replies: [
                            {
                                creator: 'dummyUser',
                                text: 'reply text3'
                            }
                        ]
                    }
                ],
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
                    email: 'test1@email.com',
                    firstName: 'firstname',
                    isAdmin: true,
                    lastName: 'lastname',
                    password: 'password',
                    phone: '0111111111',
                    username: 'adminusername'
                }, function (err2, user2) {
                    if (err) {
                        console.log(err2);
                    }
                    adminUser = user2;
                    User.create({
                        birthdate: Date.now(),
                        email: 'test1@email.com',
                        firstName: 'firstname',
                        isAdmin: true,
                        lastName: 'lastname',
                        password: 'password',
                        phone: '0111111111',
                        username: 'username'
                    }, function (err3, user3) {
                        if (err) {
                            console.log(err3);
                        }
                        creatorUser = user3;
                        done();
                    });
                });
            });
        });
    });
    // --- End of 'Clearing Mockgoose' --- //

    describe('/Activities comment detail', function () {

        /*
         * Tests for viewing on activity's comment
         *
         * @author: Wessam
         */
        it('it should return comment detail', function (done) {
            chai.request(app).
                get('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(200);
                    expect(res.body.data).to.have.ownProperty('text');
                    expect(res.body.data.text).
                        to.equal(verifiedActivity.discussion[0].text);
                    expect(res.body.data).to.have.ownProperty('replies');
                    expect(res.body.data.replies.length).
                        to.equal(verifiedActivity.discussion[0].replies.length);
                    done();
                });
        });
        it('it should return 401 for unverified activity', function (done) {
            chai.request(app).
                get('/api/activities/' +
                    pendingActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(401);
                    done();
                });
        });
        it(
            'it should return 403 for activity not admin nor creator',
            function (done) {
                var token = 'JWT ' + jwt.sign(
                    { 'id': normalUser._id },
                    config.SECRET,
                    { expiresIn: '12h' }
                );
                chai.request(app).
                    get('/api/activities/' +
                        pendingActivity._id +
                        '/comments/' +
                        verifiedActivity.discussion[0]._id).
                    set('Authorization', token).
                    end(function (err, res) {
                        // testing get activities for unverified user
                        if (err) {
                            console.log(err);
                        }
                        console.log(res.body);
                        res.should.have.status(403);
                        done();
                    });
            }
        );
        it(
            'it should return comment on pending activity for admin',
            function (done) {
                var token = 'JWT ' + jwt.sign(
                    { 'id': adminUser._id },
                    config.SECRET,
                    { expiresIn: '12h' }
                );
                chai.request(app).
                    get('/api/activities/' +
                        pendingActivity._id +
                        '/comments/' +
                        pendingActivity.discussion[0]._id).
                    set('Authorization', token).
                    end(function (err, res) {
                        // testing get activities for unverified user
                        if (err) {
                            console.log(err);
                        }
                        res.should.have.status(200);
                        expect(res.body.data).to.have.ownProperty('text');
                        expect(res.body.data.text).
                            to.equal(pendingActivity.discussion[0].text);
                        expect(res.body.data).to.have.ownProperty('replies');
                        expect(res.body.data.replies.length).to.
                            equal(pendingActivity.discussion[0].replies.length);
                        done();
                    });
            }
        );
        it(
            'it should return comment on pending activity for activity creator',
            function (done) {
                var token = 'JWT ' + jwt.sign(
                    { 'id': creatorUser._id },
                    config.SECRET,
                    { expiresIn: '12h' }
                );
                chai.request(app).
                    get('/api/activities/' +
                        pendingActivity._id +
                        '/comments/' +
                        pendingActivity.discussion[0]._id).
                    set('Authorization', token).
                    end(function (err, res) {
                        // testing get activities for unverified user
                        if (err) {
                            console.log(err);
                        }
                        res.should.have.status(200);
                        expect(res.body.data).to.have.ownProperty('text');
                        expect(res.body.data.text).
                            to.equal(pendingActivity.discussion[0].text);
                        expect(res.body.data).to.have.ownProperty('replies');
                        expect(res.body.data.replies.length).to.
                            equal(pendingActivity.discussion[0].replies.length);
                        done();
                    });
            }
        );
        it(
            'it should return 404 for wrong comment id',
            function (done) {
                chai.request(app).
                    get('/api/activities/' +
                        verifiedActivity._id +
                        '/comments/' +
                        pendingActivity.discussion[0]._id).
                    end(function (err, res) {
                        // testing get activities for unverified user
                        if (err) {
                            console.log(err);
                        }
                        res.should.have.status(404);
                        done();
                    });
            }
        );
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
