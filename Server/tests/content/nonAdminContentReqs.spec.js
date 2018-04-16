
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var expect = chai.expect;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nawwar');
var contReq = mongoose.model('ContentRequest');
var cont = mongoose.model('Content');
chai.use(chaiHttp);
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var nonAdminToken = null;

var nonAdminUser = {
    birthdate: '2/6/1999',
    email: 'salma@salmaa.admin',
    firstName: 'adminsalma',
    isAdmin: true,
    lastName: 'adminsalma',
    password: 'adminsalma',
    phone: 23456,
    username: 'adminsalma'
};
describe('All what a nonAdmin can do', function () {
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
            send(nonAdminUser).
            end(function (err, response) {

                if (err) {
                    console.log(err);

                    return console.log(err);
                }
                response.should.have.status(201);
                nonAdminToken = response.body.token;
                done();

            });
    });
    describe('View ContentRequest tests(Unauthorized)', function () {

        it(
            'shouldn\'t get anything, should get unauthorized error' +
            '(trying to view ideas)',
            function (done) {
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
                    get('/api/admin/PendingContentRequests/idea').
                    set('Authorization', nonAdminToken).
                    end(function (err, res) {
                        if (!err === null) {
                            console.log('get Pending' +
                            'Idea Requests err msg is: ' + err);
                        }
                        should.exist(res);
                        res.should.have.property('body');
                        res.should.have.status(403);
                        expect(res.body.data).to.equal(null);
                        expect(res.body.err).to.equal('Unauthorized action');
                        done();
                    });
            }
        );
        it(
            'shouldn\'t get anything, should get unauthorized error' +
            '(trying to view resources)',
            function (done) {
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
                    get('/api/admin/PendingContentRequests/resource').
                    set('Authorization', nonAdminToken).
                    end(function (err, res) {
                        if (!err === null) {
                            console.log('get Pending' +
                            'Resource Requests msg is: ' + err);
                        }
                        should.exist(res);
                        res.should.have.property('body');
                        res.should.have.status(403);
                        expect(res.body.data).to.equal(null);
                        expect(res.body.err).to.equal('Unauthorized action');
                        done();
                    });
            }
        );
        it(
            'shouldn\'t get anything, should get unauthorized error' +
            '(trying to respond to requests)',
            function (done) {
                var Cont = new cont({
                    _id: '5aca0d4d8865fc24fe140713',
                    approved: false,
                    body: 'this is the body',
                    category: 'this is a category',
                    creator: 'salma',
                    section: 'this is a section',
                    title: 'this is a title',
                    type: 'idea'
                });
                Cont.save(function (err) {
                    if (err) {
                        console.log(err);
                    }

                    var ContReq = new contReq({
                        _id: '5aca0d4d8865fc24fe140711',
                        contentID: '5aca0d4d8865fc24fe140713',
                        contentType: 'idea',
                        createdOn: '1/1/1111',
                        creator: 'salma',
                        requestType: 'create',
                        status: 'pending'
                    });
                    ContReq.save(function (err1) {
                        if (err) {
                            console.log(err1);
                        }
                    });
                    chai.request(server).
                        patch('/api/admin/RespondContentRequest/' +
                            '5aca0d4d8865fc24fe140711/' +
                            '5aca0d4d8865fc24fe140713').
                        send({ str: 'disapproved' }).
                        set('Authorization', nonAdminToken).
                        end(function (err2, res) {
                            console.log(err);
                            if (!err === null) {
                                console.log('respond to Request err msg is: ' +
                                    err2);
                            }
                            should.exist(res);
                            res.should.have.status(403);
                            res.body.err.should.be.a('string');
                            expect(res.body.data).to.equal(null);
                            expect(res.body.err).to.equal('Unauthorized' +
                            ' action');
                            done();
                        });
                });
            }
        );
        it(
            'the content he/she tried to change is untouched',
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

    });
    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
            console.log('mockgoose closing the connection');
        });
    });

});
