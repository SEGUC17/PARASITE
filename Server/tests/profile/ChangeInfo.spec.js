var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
//var User = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
//var should = chai.should();
var request = require('supertest');

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var token = null;

describe('Add user as a parent', function () {
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

    it('It should change my personal information', function (done) {
        var user = {
            address: 'rehab',
            birthdate: '1/1/1997',
            email: 'Magicx@gmail.com',
            firstName: 'Omar',
            lastName: 'Omar',
            password: '123456789',
            phone: '01111111111',
            username: 'snickers123'
        };
        var AUser1 = {
            address: 'Cairo',
            birthdate: '5/5/1990',
            email: 'Magicxx@gmail.com',
            firstName: 'Omar',
            lastName: 'Osama',
            phone: '0122222',
            username: 'OmarOsama'
        };
        var AUser2 = {
            address: '',
            birthdate: '5/5/1990',
            email: 'Magicxx@gmail.com',
            firstName: 'Omar',
            lastName: 'Osama',
            phone: '',
            username: 'OmarOsama'
        };
        var RUser = {
            address: 'Alex',
            birthdate: '5/5/1990',
            email: 'Magicxx@gmail',
            firstName: 'Omar',
            lastName: 'Osama',
            phone: '0122222',
            username: 'OmarOsama'
        };
        var UserIn = {
            password: '123456789',
            username: 'snickers123'
        };

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
                var authenticatedUser = request.agent(server);
                // Sign in
                authenticatedUser.
                    post('/api/signIn').
                    send(UserIn).
                    end(function (error, res) {
                        res.should.have.status(200);
                        token = res.body.token;
                        var array = ['_id'];
                        //get the user info
                        chai.request(server).
                            post('/api/userData').
                            send(array).
                            set('Authorization', token).
                            end(function (Err, Res) {
                                Res.should.have.status(200);
                                // the test
                                chai.request(server).
                                    patch('/api/profile/ChangeInfo/' +
                                        Res.body.data._id).
                                    send(AUser1).
                                    set('Authorization', token).
                                    end(function (Error, Response) {
                                        if (Error) {
                                            return console.log(Error);
                                        }
                                        expect(Response).to.have.
                                            status(200);
                                        Response.body.data.should.have.
                                            property('adress').
                                            eql('Cairo');
                                        Response.body.data.should.have.
                                            property('email').
                                            eql('Magicxx@gmail.com');
                                        Response.body.data.should.have.
                                            property('birthdate').
                                            eql('5/5/1990');
                                        Response.body.data.should.have.
                                            property('lastName').
                                            eql('Osama');
                                        Response.body.data.should.have.
                                            property('phone').
                                            eql([
                                                '01111111111',
                                                '0122222'
                                            ]);
                                        Response.body.data.should.have.
                                            property('username').
                                            eql('OmarOsama');

                                        done();
                                    });

                            });
                    });

            });

    });

});
