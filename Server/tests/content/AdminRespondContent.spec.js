
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var expect = chai.expect;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nawwar');
var db = mongoose.connection;
var users = mongoose.model('User');
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
describe('Admin responding to content', function () {

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
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            console.log('mockgoose is clear');
            done();
        });
    });

    beforeEach(function (done) {
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
                    { $set: { isAdmin: true } },
                    function (err1) {
                        if (err1) {
                            console.log(err1);
                        }
                    }
                );
                done();

            });
    });
    describe('Respond Content tests', function () {

        it(
            'Content attribute approved should be true when admin approves',
            function (done) {
                var ContI1 = new cont({
                    _id: '5aca0d4d8865fc24fe140713',
                    approved: false,
                    body: 'this is the body',
                    category: 'this is a category',
                    creator: 'salma',
                    section: 'this is a section',
                    title: 'this is a title',
                    type: 'idea'
                });
                ContI1.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                chai.request(server).
                    patch('/api/admin/RespondContentStatus/' +
                        '5aca0d4d8865fc24fe140713').
                    send({ str: true }).
                    set('Authorization', adminToken).
                    end(function (err, res) {
                        if (!err === null) {
                            console.log('respond to content error msg is: ' +
                                err);
                        }
                        should.exist(res);
                        res.should.have.status(200);
                        res.body.data.approved.should.be.a('boolean');
                        expect(res.body.data.approved).to.equal(true);
                        done();
                    });
            }
        );

        it(
            'content attribute approved should be false when admin disapproves',
            function (done) {
                var ContR1 = new cont({
                    _id: '5aca0d4d8865fc24fe140714',
                    approved: false,
                    body: 'this is the body',
                    category: 'this is a category',
                    creator: 'salma',
                    section: 'this is a section',
                    title: 'this is a title',
                    type: 'idea'
                });
                ContR1.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                chai.request(server).
                    patch('/api/admin/RespondContentStatus/' +
                        '5aca0d4d8865fc24fe140714').
                    send({ str: false }).
                    set('Authorization', adminToken).
                    end(function (err, res) {
                        if (!err === null) {
                            console.log('respond to content error msg is: ' +
                                err);
                        }
                        should.exist(res);
                        res.should.have.status(200);
                        res.body.data.approved.should.be.a('boolean');
                        expect(res.body.data.approved).to.equal(false);
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
            console.log('mockgoose closing the connection');
        });
    });
});
