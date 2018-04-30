var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var User = mongoose.model('User');
var Report = mongoose.model('Report');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();
var request = require('supertest');

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var token = null;
var user1 = null;
var user2 = null;
var UserIn = {
    password: '123456789',
    username: 'ahmed'
};
var report1 = {
    id: '',
    reason: 'Inappropiate content',
    reportedPerson: 'Amr',
    reporter: 'Ahmed'
};
var report2 = {
    id: '',
    reason: 'Noreason',
    reportedPerson: 'Amr',
    reporter: 'Ahmed'
};

describe('/PATCH/ Delete Reports', function () {
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

                        //get the reported info
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

                                //reporting user 2 for the first time
                                chai.request(server).
                                    post('/api/profile/ReportUser').
                                    send(report1).
                                    set('Authorization', token).
                                    end(function (err4, res4) {
                                        if (err4) {
                                            return console.log(err4);
                                        }
                                        res4.should.have.status(201);

                                        //reporting user 2 for the second tine
                                        chai.request(server).
                                            post('/api/profile/ReportUser').
                                            send(report2).
                                            set('Authorization', token).
                                            end(function (err5, res5) {
                                                if (err5) {
                                                    return console.log(err5);
                                                }
                                                res5.should.have.status(201);
                                                // Getting the reports
                                                chai.request(server).
                                               get('/api/admin/getReports').
                                            set('Authorization', token).
                                            end(function (err, res) {
                                                        if (err) {
                                                return console.log(err);
                                                        }
                                             res.should.have.status(200);
                                            report1.id = res.body.data[0]._id;
                                            report2.id = res.body.data[1]._id;
                                          done();
                                                    });

                                            });
                                    });
                            });
                    });
            });
        });
    });
    it('It should delete the specified report', function (Done) {
        chai.request(server).
            patch('/api/admin/DeleteReport/' + report2.id).
            set('Authorization', token).
            end(function (err, res) {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(200);
                res.body.should.have.property('msg').
                    eql('Report was deleted successfully');

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
