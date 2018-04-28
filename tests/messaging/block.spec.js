/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable object-shorthand */
/* eslint-disable complexity */

var server = require('../../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var config = require('../../api/config/config');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var User = mongoose.model('User');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

var user = {
    birthdate: '3/29/1997',
    blocked: [],
    email: 'lama@gmail.com',
    isEmailVerified:'true',
    firstName: 'lama',
    lastName: 'ahmed',
    password: '123456789',
    phone: '0174536975',
    username: 'lama'
};

// token for authentication
var token = null;

describe('blocking a user from messaging me', function () {
    this.timeout(1200000);

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
    it('it should block a user from messaging me', function (done) {
        console.log('Ana wasalt el it');
        // sign up and be authenticated
      /*  chai.request(server).
            post('/api/signUp').
            send(user).
            end(function (err, response) {
                if (err) {
                    return console.log(err);
                }
                response.should.have.status(201);
                token = response.body.token;  */
              //  console.log('id is: ', response.body._id);
                // get username of logged in user

                User.create(user, function (err) {
                    if (err) {
                        return done(err);
                    }
                chai.request(server)
                .post('/api/signIn')
                .send({'password' : user.password, 
                 'username': user.username })
                .end((err6, res6) => {
                    res6.should.have.status(200);
                    res6.body.should.be.a('object');
                  res6.body.should.have.property('token');
                  token = res6.body.token;

               chai.request(server).post('/api/userData').
                    send([
                        '_id',
                     'username',
                      'blocked'
                    ]).
                    set('Authorization', token).
                    end(function (err1, result) {
                        if (err1) {
                            return console.log(err1);
                        }
                        result.should.have.status(200);
                        var message = {
                            body: 'hi',
                            recipient: 'test',
                            sender: result.body.data.username
                          };
                          // block patch request

                        console.log('TEST. Id of the user is: ', result.body.data._id);
                        chai.request(server).
                            patch('/api/message/block/' + message.recipient).
                            send(result.body.data).
                            set('Authorization', token).
                            end(function (error, res) {
                                if (error) {
                                    console.log('entered error stage');

                                    return console.log(error);
                                }
                                console.log('blocklist after: ', res.body.data.blocked);
                                res.should.have.status(200);
                                res.body.data.should.be.a('Object');
                                res.body.data.should.have.property('blocked').eql(res.body.data.blocked);

                                done();
                            });
                    });
            });
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

