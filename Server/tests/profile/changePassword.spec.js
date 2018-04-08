
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
var app = require('../../app');
var token = null;

chai.use(chaiHttp);

var user = {
    address: '13 downtown, Canterbury, Kent',
    birthdate: new Date('03/02/1984'),
    email: 'melody@anther.com',
    firstName: 'Melody',
    lastName: 'Anther',
    password: '123456789melod',
    phone: '343493202',
    username: 'melody.anther'
};

var info = {
    newpw: '12348530294024',
    oldpw: '123456789melod'
};
var array = [
    '_id',
    'uername'
];

describe('user changes password', function () {
    this.timeout(120000);
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });


    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });

    // clearing mockgoose

    it('should /patch /user password with 200 ', function (done) {

        chai.request(server).
            post('/api/signUp').
            send(user).
            end(function (error, response) {
                if (error) {
                    return console.log(error);
                }
                response.should.have.status(201);
                token = response.body.token;

                chai.request(server).
                    post('/api/userData').
                    send(array).
                    set('Authorization', token).
                    end(function (errors, userData) {
                        if (errors) {
                            return console.log(errors);
                        }
                        userData.should.have.status(200);

                        chai.request(server).
                            patch('/api/profile/changePassword/' + userData.body.data._id).
                            set('Authorization', token).
                            send(info).
                            end(function (err2, resp) {
                                if (err2) {
                                    return console.log(err2);
                                }
                                resp.should.have.status(200);

                                done();
                            });
                    });
            });
    });
});


after(function (done) {
    mongoose.connection.close(function (err) {
        done(err);
    });
});


