var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;
var sppr = mongoose.model('StudyPlanPublishRequest');
var users = mongoose.model('User');
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
    phone: 224455,
    username: 'blabla'
});

// save the documents and test
describe('Admin viewing study plan publish requests', function () {
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
        'it should GET pending study plan publish requests',
        function (done) {
            var sppr1 = new sppr({
                createdOn: '9/9/9500',
                creator: 'bla',
                requestType: 'create'
            });

            sppr1.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });

            chai.request(server).
            get('/api/admin/PendingStudyPlanPublishRequests').
            set('Authorization', token).
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                expect(res).to.have.status(200);
                res.body.data.should.be.a('array');
                res.body.data[0].should.have.property(
                    'creator',
                    'bla'
                );
                res.body.data[0].should.have.property(
                    'requestType',
                    'create'
                );
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
