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
var commentCreatorUser = null;
var replyCreatorUser = null;
var activityCreatorUser = null;
var verifiedActivity = null;

describe('Activities Comments/replies deleting', function () {

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
                creator: 'activitycreatoruser',
                name: 'activity3',
                description: 'activity3 des',
                fromDateTime: Date.now(),
                toDateTime: Date.now() + 5,
                status: 'verified',
                discussion: [
                    {
                        creator: 'commentcreatoruser',
                        text: 'comment text',
                        replies: [
                            {
                                creator: 'replycreatoruser',
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
                    if (err2) {
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
                        username: 'commentCreatorUser'
                    }, function (err3, user3) {
                        if (err3) {
                            console.log(err3);
                        }
                        commentCreatorUser = user3;
                        User.create({
                            birthdate: Date.now(),
                            email: 'test1@email.com',
                            firstName: 'firstname',
                            isAdmin: true,
                            lastName: 'lastname',
                            password: 'password',
                            phone: '0111111111',
                            username: 'activityCreatorUser'
                        }, function (err4, user4) {
                            if (err4) {
                                console.log(err4);
                            }
                            activityCreatorUser = user4;
                            User.create({
                                birthdate: Date.now(),
                                email: 'test1@email.com',
                                firstName: 'firstname',
                                isAdmin: true,
                                lastName: 'lastname',
                                password: 'password',
                                phone: '0111111111',
                                username: 'replyCreatorUser'
                            }, function (err5, user5) {
                                if (err5) {
                                    console.log(err4);
                                }
                                replyCreatorUser = user5;
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
    // --- End of 'Clearing Mockgoose' --- //

    describe('/Deleting comments/replies', function () {

        /*
         * Tests for Commenting on activities
         *
         * @author: Wessam
         */

        it('it should delete comment by comment creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': commentCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion.length).to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should delete comment by activity creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': activityCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion.length).to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should delete comment by admin', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion.length).to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should return 403 for normal user', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(403);

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
        it('it should return 401 for unverified user', function (done) {
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id).
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
                            expect(activity.discussion.length).to.equal(1);
                            done();
                        }
                    );
                });
        });
        it('it should return 404 for wrong activity id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity.discussion[0]._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(404);

                    done();
                });
        });
        it('it should return 404 for wrong comment id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(404);

                    done();
                });
        });
        it('it should delete reply by reply creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': replyCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id +
                    '/replies/' +
                    verifiedActivity.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion[0].replies.length).
                            to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should delete reply by comment creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': commentCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id +
                    '/replies/' +
                    verifiedActivity.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion[0].replies.length).
                                to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should delete reply by activity creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': activityCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id +
                    '/replies/' +
                    verifiedActivity.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion[0].replies.length).
                                to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should delete reply by admin', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id +
                    '/replies/' +
                    verifiedActivity.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion[0].replies.length).
                                to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should return 403 for normal user', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id +
                    '/replies/' +
                    verifiedActivity.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(403);

                    Activity.findById(
                        verifiedActivity._id,
                        function (err2, activity) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(activity.discussion[0].replies.length).
                                to.equal(1);
                            done();
                        }
                    );
                });
        });
        it('it should return 401 for unverified user', function (done) {
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id +
                    '/replies/' +
                    verifiedActivity.discussion[0].replies[0]._id).
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
                            expect(activity.discussion[0].replies.length).
                                to.equal(1);
                            done();
                        }
                    );
                });
        });
        it('it should return 404 for wrong activity id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': replyCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity.discussion[0]._id +
                    '/comments/' +
                    verifiedActivity.discussion[0]._id +
                    '/replies/' +
                    verifiedActivity.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(404);
                    done();
                });
        });
        it('it should return 404 for wrong comment id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': replyCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity.discussion[0]._id +
                    '/comments/' +
                    verifiedActivity._id +
                    '/replies/' +
                    verifiedActivity.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(404);
                    done();
                });
        });
        it('it should return 404 for wrong reply id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': replyCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/activities/' +
                    verifiedActivity.discussion[0]._id +
                    '/comments/' +
                    verifiedActivity._id +
                    '/replies/' +
                    verifiedActivity._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(404);
                    done();
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
});
