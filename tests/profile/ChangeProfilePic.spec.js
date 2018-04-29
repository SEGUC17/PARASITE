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
var user1 = null;
var UserIn = {
    password: '123456789',
    username: 'ahmed'
};
// patch('/profile/ChangeProfilePic'
describe('/PATCH/ Change Profile Pic ', function () {
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
                send(UserIn).
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

    it('It should change my profile pic', function (Done) {
        var test = {
            id: user1.id,
            url: '/home/yomna/Pictures/image2.jpg'
        };
        chai.request(server).
            patch('/api/profile/ChangeProfilePic').
            send(test).
            set('Authorization', token).
            end(function (err, res) {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(200);
                res.body.should.have.property('msg').
                    eql('Profile picture updated successfully.');
                res.body.data.should.have.property('avatar').
                    eql('/home/yomna/Pictures/image2.jpg');
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
