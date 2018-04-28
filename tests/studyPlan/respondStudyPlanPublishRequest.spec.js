var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();
var users = mongoose.model('User');
var sppr = mongoose.model('StudyPlanPublishRequest');
var StudyPlan = mongoose.model('StudyPlan');
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
chai.use(chaiHttp);
var token = null;

var admin = new users({
    birthdate: '06/16/1997',
    email: 'bla@bla.bla',
    firstName: 'bla',
    isAdmin: true,
    isEmailVerified: true,
    lastName: 'bla',
    password: '123bla456bla',
    phone: 1222357686,
    username: 'blabla'
});

// save the documents and test
describe('Admin responding to study plan publish requests', function () {
    this.timeout(120000);
    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                // save user
                admin.save(function (err) {
                    if (err) {
                        throw err;
                    }

                    //login to be authenticated
                    chai.request(server).
                        post('/api/signIn').
                        send({
                            'password': '123bla456bla',
                            'username': 'blabla'
                        }).
                        end(function (err2, res) {
                            if (err2) {
                                done(err2);
                            } else {
                                res.should.have.status(200);
                                token = res.body.token;
                                done();
                            }
                        });
                });

            });
});
    });


    it(
        'Publish requests should be approved when admin approves',
        function (done) {
            var sppr1 = new sppr({
                _id: '5ad2b1726512f807d6ef26ca',
                createdOn: '9/9/9500',
                creator: 'bla',
                requestType: 'create'
            });
            sppr1.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
            var sp = new StudyPlan({
                _id: '5ad2b5296512f807d6ef15cb',
                creator: 'bla',
                description: 'bkablabla',
                title: 'blaaah'
            });
            sp.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
            chai.request(server).
            patch('/api/admin/RespondStudyPlanPublishRequest/' +
                '5ad2b1726512f807d6ef26ca/5ad2b5296512f807d6ef15cb').
            send({ respo: 'approved' }).
            set('Authorization', token).
            end(function (err, res) {
                if (!err === null) {
                    console.log(err);
                }
                should.exist(res);
                // console.log(res.error);
                // console.log(res.error);
                res.should.have.status(200);
                res.body.data.status.should.be.a('string');
                expect(res.body.data.status).to.equal('approved');
                done();
            });
        }
    );

    it(
        'Publish requests should be disapproved when admin disapproves',
        function (done) {
            var sppr1 = new sppr({
                _id: '5ad2b1726512f807d6ef25ca',
                createdOn: '9/9/9500',
                creator: 'bla',
                requestType: 'create'
            });
            sppr1.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
            var sp = new StudyPlan({
                _id: '5ad2b5296512f807d6ef25cb',
                creator: 'bla',
                description: 'bkablabla',
                title: 'blaaah'
            });
            sp.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
            chai.request(server).
            patch('/api/admin/RespondStudyPlanPublishRequest/' +
                '5ad2b1726512f807d6ef25ca/5ad2b5296512f807d6ef25cb').
            send({ respo: 'disapproved' }).
            set('Authorization', token).
            end(function (err, res) {
                if (!err === null) {
                    console.log(err);
                }
                should.exist(res);
                // console.log(res.error);
                // console.log(res.error);
                res.should.have.status(200);
                res.body.data.status.should.be.a('string');
                expect(res.body.data.status).to.equal('disapproved');
                done();
            });
        }
    );

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
