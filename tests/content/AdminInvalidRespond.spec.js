
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var expect = chai.expect;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nawwar');
var db = mongoose.connection;
var users = mongoose.model('User');
var contReq = mongoose.model('ContentRequest');
var cont = mongoose.model('Content');
chai.use(chaiHttp);
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var adminToken = null;

var adminUser = {
    birthdate: '2/6/1999',
    email: 'salma@salmaa.admin',
    firstName: 'adminsalma',
    isAdmin: true,
    lastName: 'adminsalma',
    password: 'adminsalma',
    phone: 23456,
    username: 'adminsalma'
};
describe('Invalid and non-existing inputs', function () {
    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                console.log('mongoose connected');
                done();
            });
        });
    });
    // --- Clearing Mockgoose --- //
    before(function (done) {
        mockgoose.helper.reset().then(function () {
            console.log('mockgoose is clear');
            done();
        });
    });

    before(function (done) {
        chai.request(server).
            post('/api/signUp').
            send(adminUser).
            end(function (err, response) {

                if (err) {
                    console.log(err);

                    return console.log(err);
                }
                response.should.have.status(201);
                adminToken = response.body.token;
                users.updateOne(
                    { username: 'adminsalma' },
                    {
                        $set:
                            {
                                isAdmin: true,
                                isEmailVerified: true
                            }
                    },
                    function (err1) {
                        if (err1) {
                            console.log(err1);
                        }
                    }
                );
                done();

            });
    });
    describe('NonExistent/Invalid requests tests', function () {

        it(
            'Non-existent query should display error 404(nonexistent Content)',
            function (done) {
                chai.request(server).
                    post('/api/signIn').
                    send({
                        'password': 'adminsalma',
                        'username': 'adminsalma'
                    }).
                    end(function (errr, responsse) {
                        if (errr) {
                            return console.log(errr);
                        }
                        adminToken = responsse.body.token;

                        var Cont = new cont({
                            _id: '5aca0d4d8865fc24fe140713',
                            approved: false,
                            body: 'this is the body',
                            category: 'this is a category',
                            creator: 'adminsalma',
                            section: 'this is a section',
                            title: 'this is a title',
                            type: 'idea'
                        });
                        Cont.save(function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        var ContReqI1 = new contReq({
                            _id: '5aca0d4d8865fc24fe140711',
                            contentID: '5aca0d4d8865fc24fe140713',
                            contentType: 'idea',
                            createdOn: '1/1/1111',
                            creator: 'adminsalma',
                            requestType: 'create',
                            status: 'pending'
                        });
                        ContReqI1.save(function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });

                        chai.request(server).
                            patch('/api/admin/RespondContentRequest/' +
                                '5aca0d4d8865fc24fe140714/' +
                                '5aca0d4d8865fc24fe140713').
                            send({
                                approved: true,
                                oldScore: 0,
                                str: 'approved',
                                userName: 'adminsalma'
                            }).
                            set('Authorization', responsse.body.token).
                            end(function (err, res) {
                                if (!err === null) {
                                    console.log(err);
                                }
                                should.exist(res);
                                res.should.have.property('body');
                                res.should.have.status(404);
                                res.body.err.should.be.a('string');
                                expect(res.body.data).to.equal(null);
                                expect(res.body.err).to.
                                equal('Request not found');
                                done();
                            });
                    });
            }
        );
        it(
            'User should\'nt get any extra points',
            function (done) {
                chai.request(server).
                    post('/api/signIn').
                    send({
                        'password': 'adminsalma',
                        'username': 'adminsalma'
                    }).
                    end(function (errr, responsse) {
                        if (errr) {
                            return console.log(errr);
                        }
                        adminToken = responsse.body.token;

                        chai.request(server).
                            post('/api/userData').
                            send(['contributionScore']).
                            set('Authorization', responsse.body.token).
                            end(function (errUser, user) {
                                user.should.have.status(200);
                                user.body.data.should.
                                    have.property('contributionScore');
                                expect(user.body.data.contributionScore).
                                    to.equal(0);
                                done();
                            });
                    });
            }
        );

        it(
            'if ContentRequest ID is missing but Content ID exists,' +
            'it shouldn\'t be altered',
            function (done) {
                chai.request(server).get('/api/content/view/' +
                    '5aca0d4d8865fc24fe140713').
                    end(function (error, resCont) {
                        if (error) {
                            return console.log(error);
                        }
                        expect(resCont).to.have.status(200);
                        resCont.body.data.should.be.a('Object');
                        expect(resCont.body.data.approved).
                            to.equal(false);
                        done();
                    });
            }
        );
        it(
            'User should\'nt get any extra points',
            function (done) {
                chai.request(server).
                    post('/api/signIn').
                    send({
                        'password': 'adminsalma',
                        'username': 'adminsalma'
                    }).
                    end(function (errr, responsse) {
                        if (errr) {
                            return console.log(errr);
                        }
                        adminToken = responsse.body.token;

                        chai.request(server).
                            post('/api/userData').
                            send(['contributionScore']).
                            set('Authorization', responsse.body.token).
                            end(function (errUser, user) {
                                user.should.have.status(200);
                                user.body.data.should.
                                    have.property('contributionScore');
                                expect(user.body.data.contributionScore).
                                    to.equal(0);
                                done();
                            });
                    });
            }
        );
        it(
            'Invalid requestId should display error 422' +
            '(On invalid ObjectId Of Request)',
            function (done) {
                chai.request(server).
                    post('/api/signIn').
                    send({
                        'password': 'adminsalma',
                        'username': 'adminsalma'
                    }).
                    end(function (errr, responsse) {
                        if (errr) {
                            return console.log(errr);
                        }
                        adminToken = responsse.body.token;

                        chai.request(server).
                            patch('/api/admin/RespondContentRequest/' +
                                '1/2').
                            send({
                                approved: true,
                                oldScore: 0,
                                str: 'approved',
                                userName: 'adminsalma'
                            }).
                            set('Authorization', responsse.body.token).
                            end(function (err, res) {
                                if (!err === null) {
                                    console.log(err);
                                }
                                should.exist(res);
                                res.should.have.property('body');
                                res.should.have.status(422);
                                res.body.err.should.be.a('string');
                                expect(res.body.data).to.equal(null);
                                expect(res.body.err).to.equal('The Request Id' +
                                    ' is not valid');
                                done();
                            });
                    });
            }
        );
        it(
            'User should\'nt get any extra points',
            function (done) {
                chai.request(server).
                    post('/api/signIn').
                    send({
                        'password': 'adminsalma',
                        'username': 'adminsalma'
                    }).
                    end(function (errr, responsse) {
                        if (errr) {
                            return console.log(errr);
                        }
                        adminToken = responsse.body.token;

                        chai.request(server).
                            post('/api/userData').
                            send(['contributionScore']).
                            set('Authorization', responsse.body.token).
                            end(function (errUser, user) {
                                user.should.have.status(200);
                                user.body.data.should.
                                    have.property('contributionScore');
                                expect(user.body.data.contributionScore).
                                    to.equal(0);
                                done();
                            });
                    });
            }
        );


        // // --- Clearing Mockgoose --- //
        // after(function (done) {
        //     mockgoose.helper.reset().then(function () {
        //         done();
        //     });
    });
    // --- End of "Clearing Mockgoose" --- //

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
            console.log('mockgoose closing the connection');
        });
    });

});
