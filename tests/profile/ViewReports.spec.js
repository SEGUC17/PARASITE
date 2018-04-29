var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var User = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();
var request = require('supertest');

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var token = null;

var report1 = {
    reason: 'Inappropiate content',
    reportedPerson: 'Amr',
    reporter: 'Ahmed'
};
//the reporter
var user1 = {
    address: 'rehab',
    birthdate: '10/10/1997',
    email: 'ahmed@gmail.com',
    firstName: 'lama',
    id: '',
    lastName: 'ahmed',
    password: '123456789',
    phone: '01111111111',
    username: 'ahmed'
};
// the reported user
var user2 = null;
var UserIn = {
    password: '123456789',
    username: 'ahmed'
};

describe('/GET/ View reports', function () {
    this.timeout(120000);

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });
    // --- End of "Mockgoose Initiation" --- //


    // --- Clearing Mockgoose --- //
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //
    beforeEach(function (done) {
        //sign up for the reported user
        User.create({
            address: 'rehab',
            birthdate: '10/10/1997',
            email: 'amr@gmail.com',
            firstName: 'lama',
            isEmailVerified: true,
            lastName: 'ahmed',
            password: '123456789',
            phone: '01111111111',
            username: 'Amr'
        }, function (err1, usera) {
            if (err1) {
                return console.log(err1);
            }
            user2 = usera;

            //sign up for the reporter
            User.create({
                address: 'rehab',
                birthdate: '10/10/1997',
                email: 'ahmed@gmail.com',
                firstName: 'lama',
                id: '',
                isEmailVerified: true,
                lastName: 'ahmed',
                password: '123456789',
                phone: '01111111111',
                username: 'ahmed'
            }, function (err2, userb) {
                if (err2) {
                    return console.log(err2);
                }
                user1 = userb;

                        var authenticatedUser = request.agent(server);

                        //sing in for the reporter
                        authenticatedUser.
                            post('/api/signIn').
                            send(UserIn).
                            end(function (err3, res3) {
                                if (err3) {
                                    return console.log(err3);
                                }
                                res3.should.have.status(200);
                                token = res3.body.token;

                                //get the user info
                                chai.request(server).
                                    post('/api/userData').
                                    send(['_id']).
                                    set('Authorization', token).
                                    end(function (Err, Res) {
                                        if (Err) {
                                            return console.log(Err);
                                        }
                                        Res.should.have.status(200);
                                        user1.id = Res.body.data._id;

                                        //reporting user 2
                                        chai.request(server).
                                            post('/api/profile/ReportUser').
                                            send(report1).
                                            set('Authorization', token).
                                            end(function (err4, res4) {
                                                if (err4) {
                                                    return console.log(err4);
                                                }
                                                res4.should.have.status(201);
                                                done();
                                            });
                                    });
                            });
                    });
            });
        });
        it('It should display all reports', function (Done) {

            chai.request(server).
                get('/api/admin/getReports').
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        return console.log(err);
                    }
                    expect(res).to.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.data[0].should.have.property('reportedPerson').
                    eql('amr');
                    res.body.data[0].should.have.property('reporter').
                    eql('ahmed');
                    res.body.data[0].should.have.property('reason').
                        eql('Inappropiate content');
                    Done();
                });
        });

        // --- Mockgoose Termination --- //
        after(function (done) {
            mongoose.connection.close(function () {
                done();
            });
        });
        // --- End of "Mockgoose Termination" --- //


    });
