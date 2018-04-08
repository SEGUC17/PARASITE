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
    lastName: 'ayman',
    password: '123456789',
    phone: '0174536975',
    username: 'sarah'
};

// token for authentication
var token = null;

describe('/POST message', function () {
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

  it('it should send a message to the specified recipient', function (done) {

    /*var user1 = new User({
        birthdate: '2/6/1997',
        email: 'test@gmail.com',
        firstName: 'test',
        lastName: 'test',
        password: '123456789',
        phone: '0174536975',
        username: 'test'
    });*/

    // sign up and be authenticated
    chai.request(server).
    post('/api/signUp').
    send(user).
    end(function (err, response) {
        if (err) {
            return console.log(err);
        }
        response.should.have.status(201);
        token = response.body.token;

        // get username of logged in user
        chai.request(server).post('/api/userData').
            send(['username']).
            set('Authorization', token).
            end(function (err, result) {
                if (err) {
                    return console.log(err);
                }
                result.should.have.status(200);
                var message = {
                    body: 'hi',
                    recipient: 'test',
                    sender: result.body.data.username
                };
        
            chai.request(server).
                post('/api/message/sendMessage').
                send(message).
                set('Authorization', token).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                     }
                    // console.log(res.body.data);
                    res.should.have.status(200);
                    res.body.data.should.be.a('Object');
                    res.body.data.should.have.property('sender').eql(result.body.data.username);
                    res.body.data.should.have.property('recipient').eql(message.recipient);
                    res.body.data.should.have.property('body').eql(message.body);
                    
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
