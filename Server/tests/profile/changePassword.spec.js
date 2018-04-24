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

chai.use(chaiHttp);

var info = {
    newpw: '12348530294024',
    oldpw: '123456789melod'
};
var array = [
    '_id',
    'uername'
];

var falseInfo = {
    newpw: '123485okokokokokok30294024',
    oldpw: '123456gregererhe789melod'
};

var oldPassword = null;


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
        var that = this;
        this.user = {
            address: '13 downtown, Canterbury, Kent',
            birthdate: new Date('03/02/1984'),
            email: 'melody@anther.com',
            firstName: 'Melody',
            lastName: 'Anther',
            password: '123456789melod',
            phone: '343493202',
            username: 'melody.anther',
            isEmailVerified: true
        };
        this.token  = '';


        
        mockgoose.helper.reset().then(function () {
            User.create(that.user, function (error) {
                if (error) {
                    return done(err);
            }

            chai.request(server).
            post('/api/signIn').
            send({
                username: 'melody.anther',
                password: '123456789melod'
            }).
            end(function (error, response) {
                if (error) {
                    done(error);
                } else {
                response.should.have.status(200);
                that.token = response.body.token;
                done();
                }
            });
        });
    });
  });


    // clearing mockgoose

    it('should /PATCH/user password and return 200 ', function (done) {

                chai.request(server).
                    post('/api/userData').
                    send(array).
                    set('Authorization', this.token).
                    end(function (errors, userData) {
                        if (errors) {
                            return console.log(errors);
                        }
                        userData.should.have.status(200);
                        oldPassword = userData.body.data.password;
                        chai.request(server).
                            patch('/api/profile/changePassword/' +
                                userData.body.data._id).
                                send(info).
                                end(function (err2, resp) {
                                if (err2) {
                                    return console.log(err2);
                                }
                                resp.should.have.status(200);


                                resp.body.data.password.should.be.a('string').not.
                                    equal(oldPassword);

                                done();

                            });
                    });
                });
        it('should -not- /PATCH/ user password and return 401',  function(done) {
            chai.request(server).
            post('/api/userData').
            send(array).
                    set('Authorization', this.token).
                    end(function (errors, userData) {
                        if (errors) {
                            return console.log(errors);
                        }
                        userData.should.have.status(200);
                        oldPassword = userData.body.data.password;
                        chai.request(server).
                            patch('/api/profile/changePassword/' +
                                userData.body.data._id).
                                send(falseInfo).
                                end(function (err2, resp) {
                                if (err2) {
                                    return console.log(err2);
                                }
                                resp.should.have.status(401);

                                done();

                            });
                    });
        })
        
    



    after(function (done) {
        mongoose.connection.close(function (err) {
            done(err);
        });
    });

});