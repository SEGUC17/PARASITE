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

var commentBody = null;

describe('Activities Comments creation', function () {

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
            commentBody = { text: 'comment test text' };
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

    describe('/Commenting on activities', function () {

        /*
         * Tests for Commenting on activities
         *
         * @author: Wessam
         */
        it('it should comment on the activity', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                post('/api/activities/' + verifiedActivity._id + '/comments').
                send(commentBody).
                set('Authorization', token).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    expect(res.body.data).to.have.ownProperty('text');
                    expect(res.body.data).to.have.ownProperty('_id');
                    expect(res.body.data.text).to.equal(commentBody.text);
                    expect(res.body.data.creator).to.equal(normalUser.username);
                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion.length).to.equal(2);
                            done();
                        }
                    );
                });
        });
        it('it should return the right comment in the body', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            var existingComment = { text: 'comment text' };
            chai.request(app).
                post('/api/activities/' + verifiedActivity._id + '/comments').
                send(existingComment).
                set('Authorization', token).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    expect(res.body.data).to.have.ownProperty('text');
                    expect(res.body.data).to.have.ownProperty('_id');
                    expect(res.body.data.creator).to.equal(normalUser.username);
                    expect(res.body.data.text).to.equal(existingComment.text);
                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion.length).to.equal(2);
                            done();
                        }
                    );
                });
        });
        it('it should return 401 for unverified user', function (done) {
            var existingComment = { text: 'comment text' };
            chai.request(app).
                post('/api/activities/' + verifiedActivity._id + '/comments').
                send(existingComment).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(401);
                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion.length).to.equal(1);
                            done();
                        }
                    );
                });
        });
        it('it should return 422 for empty text', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                post('/api/activities/' + verifiedActivity._id + '/comments').
                send({ text: '' }).
                set('Authorization', token).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(422);
                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion.length).to.equal(1);
                            done();
                        }
                    );
                });
        });
        it(
            'it should return 404 for commenting on a pedning activity',
            function (done) {
                var token = 'JWT ' + jwt.sign(
                    { 'id': normalUser._id },
                    config.SECRET,
                    { expiresIn: '12h' }
                );
                chai.request(app).
                    post('/api/activities/' + pendingActivity._id +
                        '/comments').
                    send(commentBody).
                    set('Authorization', token).
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
        it('it should comment on pending activity by creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': creatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                post('/api/activities/' + pendingActivity._id + '/comments').
                send(commentBody).
                set('Authorization', token).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    expect(res.body.data).to.have.ownProperty('text');
                    expect(res.body.data).to.have.ownProperty('_id');
                    expect(res.body.data.text).to.equal(commentBody.text);
                    expect(res.body.data.creator).
                        to.equal(creatorUser.username);
                    Activity.findById(
                        pendingActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion.length).to.equal(2);
                            done();
                        }
                    );
                });
        });
        it('it should comment on pending activity by adming', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                post('/api/activities/' + pendingActivity._id + '/comments').
                send(commentBody).
                set('Authorization', token).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    expect(res.body.data).to.have.ownProperty('text');
                    expect(res.body.data).to.have.ownProperty('_id');
                    expect(res.body.data.text).to.equal(commentBody.text);
                    expect(res.body.data.creator).
                        to.equal(adminUser.username);
                    Activity.findById(
                        pendingActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion.length).to.equal(2);
                            done();
                        }
                    );
                });
        });
        it('it should reply on comment', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                post('/api/activities/' + verifiedActivity._id + '/comments/' +
                    verifiedActivity.discussion[0]._id + '/replies/').
                send(commentBody).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    expect(res.body.data).to.have.ownProperty('text');
                    expect(res.body.data).to.have.ownProperty('_id');
                    expect(res.body.data.text).to.equal(commentBody.text);
                    expect(res.body.data.creator).to.equal(normalUser.username);
                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion[0].
                                replies.length).to.equal(2);
                            done();
                        }
                    );
                });
        });
        it('it return 401 for unverified user', function (done) {
            chai.request(app).
                post('/api/activities/' + verifiedActivity._id + '/comments/' +
                    verifiedActivity.discussion[0]._id + '/replies/').
                send(commentBody).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(401);
                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion[0].
                                replies.length).to.equal(1);
                            done();
                        }
                    );
                });
        });
        it('it should return 404 for pending activity', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                post('/api/activities/' + pendingActivity._id + '/comments/' +
                    verifiedActivity.discussion[0]._id + '/replies/').
                send(commentBody).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should return reply on comment for admin', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                post('/api/activities/' + pendingActivity._id + '/comments/' +
                    pendingActivity.discussion[0]._id + '/replies/').
                send(commentBody).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    expect(res.body.data).to.have.ownProperty('text');
                    expect(res.body.data).to.have.ownProperty('_id');
                    expect(res.body.data.text).to.equal(commentBody.text);
                    expect(res.body.data.creator).to.equal(adminUser.username);
                    Activity.findById(
                        pendingActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion[0].
                                replies.length).to.equal(2);
                            done();
                        }
                    );
                });
        });
        it('it should return 404 for wrong comment id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                post('/api/activities/' + verifiedActivity._id + '/comments/' +
                    pendingActivity.discussion[0]._id + '/replies/').
                send(commentBody).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should return 422 for empty text', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                post('/api/activities/' + verifiedActivity._id + '/comments/' +
                    verifiedActivity.discussion[0]._id + '/replies/').
                send({ text: '' }).
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
