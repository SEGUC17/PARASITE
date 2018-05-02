// dev dependancies

var expect = require('chai').expect;
var request = require('request');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var childsignup = require('../../api/controllers/UserController');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var User = require('../../api/models/User');
var mockgoose = new Mockgoose(mongoose);
var config = require('../../api/config/config');
var should = chai.should();
var Message = mongoose.model('Message');


chai.use(chaiHttp);

describe('unregisterd user sends contacts Admins', function () {
    this.timeout(120000);
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });

  it('should /POST/ message and return 200', function (done) {
    mockgoose.helper.reset().then(function () {
    chai.request(server).
    post('/api/message/contactus').
    send({
        body: 'hello',
        recipient: '',
        sender: 'random_user@email.com'
    }).
    end(function (Error, response) {
        if (Error) {
            done(Error);
        } else {
        response.should.have.status(200);
        done();
        }
    });
});
});
    // clearing mockgoose
    after(function (done) {
        mongoose.connection.close(function (err) {
            done(err);
        });
    });

});
