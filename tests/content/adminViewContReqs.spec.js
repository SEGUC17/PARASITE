
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
    isEmailVerified: true,
    lastName: 'adminsalma',
    password: 'adminsalma',
    phone: 23456,
    username: 'adminsalma'
};
describe('Admin viewing ContentRequests', function () {
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
    before(function (done) {
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
            });
        done();
    });

    describe('View ContentRequest tests', function () {

        it('should get all pending idea contentRequests', function (done) {
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
            var ContReqI1 = new contReq({
                contentType: 'idea',
                createdOn: '1/1/1111',
                creator: 'salma',
                requestType: 'create'
            });
            ContReqI1.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });

            chai.request(server).
                get('/api/admin/PendingContentRequests/false/true/false/false').
                set('Authorization', responsse.body.token).
                end(function (err, res) {
                    if (!err === null) {
                        console.log('get Pending Idea Requests err msg is: ' +
                            err);
                    }
                    should.exist(res);
                    res.should.have.property('body');
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].should.have.property(
                        'contentType',
                        'idea'
                    );
                    res.body.data[0].should.have.property(
                        'creator',
                        'salma'
                    );
                    res.body.data[0].should.have.property(
                        'requestType',
                        'create'
                    );
                    done();
                });
        });
    });
        it('should get all pending resource contentRequests', function (done) {
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

            var ContReqR1 = new contReq({
                contentType: 'resource',
                createdOn: '1/1/1111',
                creator: 'salma',
                requestType: 'create'
            });
            ContReqR1.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });

            chai.request(server).
                get('/api/admin/PendingContentRequests/true/false/false/false').
                set('Authorization', adminToken).
                end(function (err, res) {
                    if (!err === null) {
                        console.log('get Pending Resource Requests msg is: ' +
                            err);
                    }
                    should.exist(res);
                    res.should.have.property('body');
                    res.should.have.status(200);
                    res.body.data.should.be.an('array');
                    res.body.data[0].should.have.property(
                        'contentType',
                        'resource'
                    );
                    res.body.data[0].should.have.property(
                        'creator',
                        'salma'
                    );
                    res.body.data[0].should.have.property(
                        'requestType',
                        'create'
                    );
                    done();
                });
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
            console.log('mockgoose closing the connection');
        });
    });

});
