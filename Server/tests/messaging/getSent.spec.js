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

// user
var user = {
    birthdate: '2/6/1997',
    email: 'sarah@gmail.com',
    firstName: 'sarah',
    isEmailVerified: true,
    lastName: 'ayman',
    password: '123456789',
    phone: '0174536975',
    username: 'sarah'
};

// token for authentication
var token = null;

describe('/GET sent messages', function () {
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

    it('it should GET all sent messages of logged in user', function (done) {

        User.create(user, function(error) {
            if (error) {
                return done(error);
            }

        // message that should be retreived
        var message = new Message({
            body: 'hi',
            recipient: 'blah',
            sender: 'sarah'
        });

        // message that should not be retreived
        var message1 = new Message({
            body: 'hi',
            recipient: 'hsghg',
            sender: 'blah'
        });

        // sign in and be authenticated
        chai.request(server).
            post('/api/signIn').
            send({
                'password': user.password,
                'username': user.username
            }).
            end(function (err, response) {
                if (err) {
                    return console.log(err);
                }
                response.should.have.status(200);
                token = response.body.token;

                message.save(function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    message1.save(function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        // get username of logged in user
                        chai.request(server).post('/api/userData').
                            send(['username']).
                            set('Authorization', token).
                            end(function (err, result) {
                                if (err) {
                                    return console.log(err);
                                }
                                result.should.have.status(200);

                                chai.request(server).
                                    get('/api/message/sent/' + result.body.data.username).
                                    set('Authorization', token).
                                    end(function (error, res) {
                                        if (error) {
                                            return console.log(error);
                                        }
                                        // console.log(res.body.data);
                                        res.should.have.status(200);
                                        res.body.data.should.be.a('array');
                                        var msgs = res.body.data.docs;
                                        for (var msg in msgs) {
                                            msg.should.have.property('sender').eql(result.body.data.username);
                                            msg.should.have.property('body');
                                            msg.should.have.property('sentAt');
                                        }
                                        done();
                                    });
                            });
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

