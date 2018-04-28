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
var token2 = null;

var user1 = null;
var user2 = null;
var UserIn1 = {
    password: '123456789',
    username: 'ahmed'
};
var UserIn2 = {
    password: '123456789',
    username: 'Amr'
};
//patch('/admin/BanUser/:username'
describe('/PATCH/ Ban Users', function () {
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
        // user2
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
            // user1
            User.create({
                address: 'rehab',
                birthdate: '10/10/1997',
                email: 'ahmed@gmail.com',
                firstName: 'lama',
                id: '',
                isAdmin: true,
                isEmailVerified: true,
                lastName: 'ahmed',
                password: '123456789',
                phone: '01111111111',
                username: 'ahmed'
            }, function (err2, user) {
                if (err2) {
                    return console.log(err2);
                }
                user1 = user;
                var authenticatedUser = request.agent(server);

                //sing in for user1
                authenticatedUser.
                    post('/api/signIn').
                    send(UserIn1).
                    end(function (err3, res3) {
                        if (err3) {
                            return console.log(err3);
                        }
                        res3.should.have.status(200);
                        token = res3.body.token;

                        //get the user1 info
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
                                done();
                            });
                    });
            });
        });
    });
    it(
        'It should ban the user and set the isBanned flge to true',
        function (Done) {
            chai.request(server).
                patch('/api/admin/BanUser/' + user2.username).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        return console.log(err);
                    }
                    res.should.have.status(200);
                    res.body.data.should.have.property('isBanned').eql(true);
                    res.body.should.have.property('msg').
                        eql('User banned successfully');
                    var authenticatedUser = request.agent(server);

                    //sing in for the reporter
                    authenticatedUser.
                        post('/api/signIn').
                        send(UserIn2).
                        end(function (err3, res3) {
                            res3.should.have.status(422);
                            res3.body.should.have.property('msg').
                                eql('User Is Banned!');
                            Done();

                        });
                });
        }
    );

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //

});

