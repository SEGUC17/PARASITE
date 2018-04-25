var moment = require('moment');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var request = require('supertest');
var assert = chai.assert;
var mongoose = require('mongoose');
var users = mongoose.model('User');
var vcr = mongoose.model('VerifiedContributerRequest');


mongoose.connect('mongodb://localhost/nawwar');
var db = mongoose.connection;

chai.use(chaiHttp);
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var UserLogin = {
    password: '123456789',
    username: 'maher'
};
var token = null;


var user = {
    birthdate: '1/1/1980',
    email: 'maher@gmail.com',
    firstName: 'mohamed',
    lastName: 'maher',
    password: '123456789',
    phone: '12345678',
    username: 'maher'
};

var authenticatedUser = request.agent(server);

describe('Verified Contributer Requests', function() {
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });
    before(function (done) {
        chai.request(server).
        post('/api/signUp').
        send(user).
        end(function (err, response) {
            if (err) {
                return console.log(err);
            }
            response.should.have.status(201);


            users.updateOne(
                { username: 'maher' },
                { $set: { isAdmin: true, isEmailVerified: true } },
                function (err1) {
                    if (err1) {
                        throw err1;
                    }
                }
            );
            chai.request(server).
            post('/api/signIn').
            send(UserLogin).
            end(function (errr, response) {
                if (errr) {
                    return console.log(err);
                }
                token = response.body.token;
            });

            done();
        });
    });
    before(function (done) {
        var req = new vcr({
            AvatarLink: 'testAL',
            ProfileLink: 'testPL',
            RequestDate: moment().toDate(),
            _id: '5aca0d4d8865fc24fe140712',
            bio: 'testBIO',
            creator: '5aca0d4d8865fc24fe140713',
            image: 'testImg',
            name: 'testName',
            status: 'pending'
        });
        var newUser = new users({
            _id: '5aca0d4d8865fc24fe140713',
            address: '14, ibrahim nawwar',
            birthdate: moment().toDate(),
            confirmPassword: 'mahermaher',
            email: 'mo@maher.com',
            firstName: 'mohamed',
            lastName: 'maher',
            password: 'mahermaher',
            phone: '011223344',
            username: 'mohamedmaher'
        });
        newUser.save(function(err) {
            if (err) {
                console.log(err);
            }
        });
        req.save(function(err) {
            if (err) {
                console.log(err);
            }
        });
        console.log('after saving in the mochgoose');
        done();
    });
    describe('POST Verified Contributer Request', function() {
        it(
            'post a new request for contribution verification.',
            function (done) {
                chai.request(server).
                post('/api/signIn').
                send(UserLogin).
                end(function (errr, response) {
                    if (errr) {
                        return console.log(err);
                    }
                    token = response.body.token;
                    chai.request(server).
                    post('/api/profile/VerifiedContributerRequest').
                    send([]).
                    set('Authorization', token).
                    end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        should.exist(res);
                        res.should.have.status(200);
                        res.should.have.property('body');
                        assert.equal(res.body.msg, 'the request is submitted');
                    });
                });


                done();
            }
        );
    });
    var RequestId = 0;
    describe('GET Verified Contributer Request', function() {
        it('get pending Verified Contributer Requests', function (done) {
            chai.request(server).
            post('/api/signIn').
            send(UserLogin).
            end(function (errr, response) {
                if (errr) {
                    return console.log(err);
                }
                token = response.body.token;
                chai.request(server).
                get('/api/admin/VerifiedContributerRequests/pending').
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    should.exist(res);
                    res.should.have.status(200);
                    res.should.have.property('body');
                    res.body.data.should.have.property('dataField');
                    res.body.data.dataField.should.be.an('array');
                });
            });

            done();
        });
        it('get accepted Verified Contributer Requests', function (done) {
            chai.request(server).
            post('/api/signIn').
            send(UserLogin).
            end(function (errr, response) {
                if (errr) {
                    return console.log(err);
                }
                token = response.body.token;
                chai.request(server).
                get('/api/admin/VerifiedContributerRequests/approved').
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    should.exist(res);
                    res.should.have.status(200);
                    res.should.have.property('body');
                    res.body.data.should.have.property('dataField');
                    res.body.data.dataField.should.be.an('array');
                });
            });

            done();
        });
        it('get rejected Verified Contributer Requests', function (done) {
            chai.request(server).
            post('/api/signIn').
            send(UserLogin).
            end(function (errr, response) {
                if (errr) {
                    return console.log(err);
                }
                token = response.body.token;
                chai.request(server).
                get('/api/admin/VerifiedContributerRequests/disapproved').
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    should.exist(res);
                    res.should.have.status(200);
                    res.should.have.property('body');
                    res.body.data.should.have.property('dataField');
                    res.body.data.dataField.should.be.an('array');
                });
            });

            done();
        });
    });

    describe('POST Response for Verified Contributer Requests', function() {
        it(
            'Respond to a request.',
            function (done) {
                chai.request(server).
                post('/api/signIn').
                send(UserLogin).
                end(function (errr, response) {
                    if (errr) {
                        return console.log(err);
                    }
                    token = response.body.token;
                    chai.request(server).
                    patch('/api/admin/VerifiedContributerRequestRes' +
                        'pond/5aca0d4d8865fc24fe140712').
                    send({ responce: 'approved' }).
                    set('Authorization', token).
                    end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        should.exist(res);
                        res.should.have.status(200);
                        res.should.have.property('body');
                        assert.equal(res.body.msg, 'reponse has been submitted');
                    });
                });

                done();
            }
        );
    });
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
});
