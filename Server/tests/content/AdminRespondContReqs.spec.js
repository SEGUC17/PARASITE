
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
    lastName: 'adminsalma',
    password: 'adminsalma',
    phone: 23456,
    username: 'adminsalma'
};
describe('Admin responding to Requests', function() {

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
describe('Respond ContentRequest tests', function () {
    it('request should be approved when admin approves', function (done) {
        var ContReqI1 = new contReq({
            _id: '5aca0d4d8865fc24fe140711',
            contentType: 'idea',
            createdOn: '1/1/1111',
            creator: 'salma',
            requestType: 'create',
            status: 'pending'
        });
        ContReqI1.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
        //     });
        chai.request(server).
            patch('/api/admin/RespondContentRequest/' +
                '5aca0d4d8865fc24fe140711').
            send({ str: 'approved' }).
            set('Authorization', adminToken).
            end(function (err, res) {
                if (!err === null) {
                    console.log('respond to Request err msg is: ' +
                        err);
                }
                should.exist(res);
                res.should.have.status(200);
                res.body.data.status.should.be.a('string');
                expect(res.body.data.status).to.equal('approved');
                done();
            });
    });
    it(
        'request should be disapproved when admin disapproves',
        function (done) {
            var ContReqR1 = new contReq({
                _id: '5aca0d4d8865fc24fe140712',
                contentType: 'resource',
                createdOn: '1/1/1111',
                creator: 'salma',
                requestType: 'create',
                status: 'pending'
            });
            ContReqR1.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });

            chai.request(server).
                patch('/api/admin/RespondContentRequest/' +
                    '5aca0d4d8865fc24fe140712').
                send({ str: 'disapproved' }).
                set('Authorization', adminToken).
                end(function (err, res) {
                    if (!err === null) {
                        console.log('respond to Request err msg is: ' +
                            err);
                    }
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.data.status.should.be.a('string');
                    expect(res.body.data.status).to.equal('disapproved');
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
