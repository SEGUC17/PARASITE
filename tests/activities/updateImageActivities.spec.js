var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var User = mongoose.model('User');
var Activity = mongoose.model('Activity');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();

chai.use(chaiHttp);
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
chai.use(chaiHttp);

var token = null;

describe('/PATCH ActivityImage', function () {
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

it(' should update activity image', function (done) {
    var user = new User({
        birthdate: '12/12/1999',
        email: 'user@gmail.com',
        firstName: 'firstName',
        isEmailVerified: true,
        lastName: 'lastName',
        password: '12345678',
        phone: '01113999999',
        username: 'normalusername'
    });
    user.save(function (err2, save2) {
        if (err2) {
            return console.log(err2);
        }
    chai.request(server).
    post('/api/signIn').
    send({
        'password': '12345678',
        'username': 'normalusername'
    }).
    end(function (err, response) {
        if (err) {
            return console.log(err);
        }
        response.should.have.status(200);
        token = response.body.token;


    var Activity1 = new Activity({
        bookedBy: [],
        creator: 'normalusername',
        description: 'activity1 des',
        fromDateTime: Date.now(),
        image: 'assets/images/activity-view/default-activity-image.jpg',
        name: 'activity1',
        price: 50,
        status: 'pending',
        toDateTime: Date.now() + 5


 });
 Activity1.save(function (eror, save) {
    if (eror) {
        return console.log(eror);
    }


    chai.request(server).
    patch('/api/activities/' + save._id + '/EditActivityImage').
    send({ image: 'assets/images/defaultProfilePic.png' }).
    set('Authorization', token).
    end(function (error, ress) {
        if (error) {
            return console.log(error);
        }
        ress.should.have.status(200);

       ress.body.should.have.property('msg').
       eql('image is updated');
        ress.body.should.have.property('err').eql(null);
      ress.body.data.should.be.a('String');
         ress.body.data.should.be.eql('assets/images/defaultProfilePic.png');

      done();
    });
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
