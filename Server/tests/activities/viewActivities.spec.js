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
var verifiedActivity = null;
var pendingActivity = null;
var rejectedActivity = null;

describe('View Activities', function () {

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
            Activity.create({
                creator: 'normalusername',
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
                creator: 'normalusername',
                name: 'activity3',
                description: 'activity3 des',
                fromDateTime: Date.now(),
                toDateTime: Date.now() + 5,
                status: 'verified',
                discussion: [
                    {
                        creator: 'normalusername',
                        text: 'comment text',
                        replies: [
                            {
                                creator: 'normalusername',
                                text: 'reply text'
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
                    done();
                });
            });
        });
    });
    // --- End of 'Clearing Mockgoose' --- //

    describe('/GET activities list', function () {

        /*
         * Tests for GET activities list
         *
         * @author: Wessam
         */
        it('it should GET verified activities', function (done) {
            chai.request(app).get('/api/activities').
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(200);
                    expect(res.body.data.docs.length).to.equal(1);
                    expect(res.body.data).to.have.ownProperty('page');
                    expect(res.body.data).to.have.ownProperty('pages');
                    expect(res.body.data).to.have.ownProperty('limit');
                    var activities = res.body.data.docs;
                    for (var activity in activities) {
                        activity = activities[activity];
                        expect(activity.status).to.equal('verified');
                    }
                    done();
                });
        });
        it('it shouldn\'t include discussion in body', function (done) {
            chai.request(app).get('/api/activities').
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(200);
                    expect(res.body.data.docs.length).to.equal(1);
                    var activities = res.body.data.docs;
                    for (var activity in activities) {
                        activity = activities[activity];
                        expect(activity).to.not.have.ownProperty('discussion');
                    }
                    done();
                });
        });
        it('it should GET all activities', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).get('/api/activities').
                set('Authorization', token).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(200);
                    expect(res.body.data.docs.length).to.equal(3);
                    expect(res.body.data).to.have.ownProperty('page');
                    expect(res.body.data).to.have.ownProperty('pages');
                    expect(res.body.data).to.have.ownProperty('limit');
                    done();
                });
        });
        it('it should GET pending activities', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).get('/api/activities?status=pending').
                set('Authorization', token).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(200);
                    expect(res.body.data.docs.length).to.equal(1);
                    expect(res.body.data).to.have.ownProperty('page');
                    expect(res.body.data).to.have.ownProperty('pages');
                    expect(res.body.data).to.have.ownProperty('limit');
                    var activities = res.body.data.docs;
                    for (var activity in activities) {
                        activity = activities[activity];
                        expect(activity.status).to.equal('pending');
                    }
                    done();
                });
        });
    });
    describe('/GET activity detail', function () {

        /*
         * Tests for GET activities detail
         *
         * @author: Wessam
         */
        it('it should GET verified activity', function (done) {
            chai.request(app).get('/api/activities/' + verifiedActivity._id).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(200);
                    expect(res.body.data).to.have.ownProperty('description');
                    expect(res.body.data.description).to.
                        equal(verifiedActivity.description);
                    expect(res.body.data).to.haveOwnProperty('discussion');
                    expect(res.body.data.discussion[0].text).to.
                        equal(verifiedActivity.discussion[0].text);
                        done();
                    });
        });
        it('it should GET return 403', function (done) {
            chai.request(app).get('/api/activities/' + pendingActivity._id).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(403);
                    done();
                });
        });
        it('it should GET activity for admin', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).get('/api/activities/' + rejectedActivity._id).
                set('Authorization', token).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(200);
                    expect(res.body.data).to.have.ownProperty('description');
                    expect(res.body.data.description).to.
                        equal(rejectedActivity.description);
                    done();
                });
        });
        it('it should GET activity for creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).get('/api/activities/' + rejectedActivity._id).
                set('Authorization', token).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(200);
                    expect(res.body.data).to.have.ownProperty('description');
                    expect(res.body.data.description).to.
                        equal(rejectedActivity.description);
                    done();
                });
        });
        it('it should return 404', function (done) {
            chai.request(app).get('/api/activities/5abcd64de097957f8d90c386').
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(404);
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
