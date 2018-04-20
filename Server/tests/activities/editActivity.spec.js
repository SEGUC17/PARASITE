var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var User = mongoose.model('User');
var Activity = mongoose.model('Activity');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();
//var d ate= new Date("October 13, 2014 11:13:00");
chai.use(chaiHttp);
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
chai.use(chaiHttp);

var token = null;

describe('/PATCH Activity', function () {
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

it(' should update activity information', function (done) {
    var user = {
        birthdate: '12/12/1999',
        email: 'user@gmail.com',
        firstName: 'firstName',
        lastName: 'lastName',
        password: '12345678',
        phone: '01113999999',
        username: 'normalusername'
    };
    chai.request(server).
    post('/api/signUp').
    send(user).
    end(function (err, response) {
        if (err) {
            return console.log(err);
        }
        response.should.have.status(201);
        token = response.body.token;

console.log('signed up');

    var Activity1 = new Activity({
        creator: 'normalusername',
        description: 'activity1 des',
        fromDateTime: Date.now(),
        name: 'activity1',
        price: 50,
        status: 'pending',
        toDateTime: Date.now() + 5

 });
 Activity1.save(function (eror, save) {
    if (eror) {
        return console.log(eror);
    }

 console.log('here');
    chai.request(server).
    patch('/api/activities/' + save._id + '/EditActivity').
    send({
        description: 'testDescription',
        fromDateTime: 11377,
        name: 'testActivity',
        price: 3,
        toDateTime: 123777


}).
    set('Authorization', token).
    end(function (error, ress) {
        if (error) {
            return console.log(error);
        }
        ress.should.have.status(200);
        console.log('lol');
       ress.body.should.have.property('msg').
       eql('Activity is updated');
        ress.body.should.have.property('err').eql(null);
      ress.body.data.should.be.a('Object');
         ress.body.data.should.have.
                        property('price').eql(3);
                            ress.body.data.should.have.
                        property('description').eql('testDescription');

      done();
    });
 });
});
});
    // --- End of "Clearing Mockgoose" --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });

});
