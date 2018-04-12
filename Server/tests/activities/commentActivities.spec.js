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
var rejectedActivity = null;
var pendingActivity = null;
var verifiedActivity = null;

var commentBody = { text: 'comment test text' };

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
                done();
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
                post('/api/activities/' + verifiedActivity._id + '/addComment').
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
                    done();
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
                post('/api/activities/' + verifiedActivity._id + '/addComment').
                send(existingComment).
                set('Authorization', token).
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    console.log(res.body.data);
                    expect(res.body.data).to.have.ownProperty('text');
                    expect(res.body.data).to.have.ownProperty('_id');
                    expect(res.body.data.creator).to.equal(normalUser.username);
                    expect(res.body.data.text).to.equal(existingComment.text);
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
