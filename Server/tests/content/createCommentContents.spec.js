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
var Content = mongoose.model('Content');
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
var creatorUser = null;
var pendingContent = null;
var approvedContent = null;

var commentBody = null;

describe('Contents Comments/replies creation', function () {

    /*
     * Tests for GET content both list and detail
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
            Content.create({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat1',
                creator: 'username',
                section: 'sec1',
                title: 'Test Content',
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
                ]
            }, function (err, content) {
                if (err) {
                    console.log(err);
                }
                pendingContent = content;
            });
            Content.create({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat1',
                creator: 'username',
                section: 'sec1',
                title: 'Test Content',
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
                ]
            }, function (err, content) {
                if (err) {
                    console.log(err);
                }
                approvedContent = content;
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

    describe('/Commenting on contents', function () {

        /*
         * Tests for Commenting on contents
         *
         * @author: Wessam
         */
        it('it should comment on the content', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                post('/api/content/' + approvedContent._id + '/comments').
                send(commentBody).
                set('Authorization', token).
                end(function (err, res) {
                    // testing get contents for unapproved user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(201);
                    expect(res.body.data).to.have.ownProperty('text');
                    expect(res.body.data).to.have.ownProperty('_id');
                    expect(res.body.data.text).to.equal(commentBody.text);
                    expect(res.body.data.creator).to.equal(normalUser.username);
                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion.length).to.equal(2);
                            done();
                        }
                    );
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
