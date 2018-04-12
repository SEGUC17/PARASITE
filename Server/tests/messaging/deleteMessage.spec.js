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
  birthdate: '2/2/1997',
  email: 'ibrahim@gmail.com',
  firstName: 'ibrahim',
  lastName: 'ali',
  password: '123456789',
  phone: '01155633833',
  username: 'heemo'
};

// token for authentication
var token = null;

describe('/DELETE/:id message', function () {
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

  it('should delete a message given its id', function (done) {

    // sign up and be authenticated
    chai.request(server)
      .post('/api/signUp')
      .send(user)
      .end(function (err, response) {
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

            var message = new Message({
              body: 'hi',
              recipient: 'test',
              sender: result.body.data.username
            });

            chai.request(server).
              delete('/api/message/' + message._id).
              set('Authorization', token).
              end(function (error, res) {
                if (error) {
                  return console.log(error);
                }
                // console.log(res.body.data);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.have.property('ok').eql(1);
                res.body.data.should.have.property('n').eql(0);

                done();
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


