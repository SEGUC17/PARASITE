/* eslint-disable sort-keys */
/* eslint-disable max-len */
/* eslint-disable no-shadow */

var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var User = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();
var request = require('supertest');

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);



var user = {
    birthdate: '7/7/1997',
    email: 'fsociety@gmail.com',
    firstName: 'Mr',
    lastName: 'Robot',
    password: '123456789',
    phone: '01111225223',
    username: 'fsociety'
};
var user2 = {
    birthdate: '7/7/1997',
    email: 'fsociety1@gmail.com',
    firstName: 'Mr',
    lastName: 'Robot',
    password: '123456789',
    phone: '01111225223',
    username: 'fsociety1'
};
var newInfo1 = {
    id: '',
    birthdate: '7/7/1919',
    email: 'fsociety@gmail.com',
    firstName: 'Mr',
    lastName: 'Robot',
    phone: '01111225223',
    username: 'fsociety1'
};
var newInfo2 = {
    id: '',
    birthdate: '7/7/1919',
    email: 'fsociety1@gmail.com',
    firstName: 'Mr',
    lastName: 'Robot',
    phone: '01111225223',
    username: 'fsociety'
};
var newInfo3 = {
    id: '',
    birthdate: '07/30/1997',
    email: 'fsociety@gmail.com',
    firstName: 'H',
    lastName: 'Rihan',
    phone: '01111225223',
    username: 'Hulk'
};
var userIn = {
    username: 'fsociety',
    password: '123456789'
};
var token;
var id;
var authenticatedUser = request.agent(server);

describe('/PATCH/ edit child info', function () {
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



    beforeEach(function (done) {
        chai.request(server).
            post('/api/signUp').
            send(user2).
            end(function (err, response) {

                if (err) {
                    console.log(err);

                    return console.log(err);
                }
                response.should.have.status(201);
                token = response.body.token;
                chai.request(server).
                    post('/api/signUp').
                    send(user).
                    end(function (err, response1) {

                        if (err) {
                            console.log(err);

                            return console.log(err);
                        }
                        response1.should.have.status(201);
                        token = response1.body.token;
                        authenticatedUser.
                            post('/api/signIn').
                            send(userIn).
                            end(function (err, response) {
                                response.should.have.status(200);
                                token = response.body.token;
                                var array = [
                                    '_id',
                                    'username'
                                ];
                                if (err) {
                                    console.log(err);
                                }
                                chai.request(server).
                                    post('/api/userData').
                                    send(['_id']).
                                    set('Authorization', token).
                                    end(function (err, returned) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        returned.should.have.status(200);
                                        id = returned.body.data._id;
                                        newInfo1.id = returned.body.data._id;
                                        newInfo2.id = returned.body.data._id;
                                        newInfo3.id = returned.body.data._id;
                                        done();

                                    });
                            });
                    });
            });
    });

    it('Should reject duplicate username', function (done) {
        chai.request(server).
            patch('/api/profile/changeChildInfo').
            send(newInfo1).
            end(function (err, res) {
                res.should.have.status(403);
                res.body.should.have.property('msg').eql('Username already exists');
                done();
            });
    });
    it('Should reject duplicate email address', function (done) {
        chai.request(server).
            patch('/api/profile/changeChildInfo').
            send(newInfo2).
            end(function (err, res1) {
                res1.should.have.status(403);
                res1.body.should.have.property('msg').eql('Email already exists');
                done();
            });
    });
    it('Should change the info to the new info', function (done) {
        chai.request(server).
            patch('/api/profile/changeChildInfo').
            send(newInfo3).
            end(function (err, res2) {
                res2.should.have.status(200);
                res2.body.should.have.property('msg').eql('Info updated succesfully.');
                res2.body.data.username.should.eql('hulk');
                res2.body.data.firstName.should.eql('H');
                res2.body.data.lastName.should.eql('Rihan');
                res2.body.data.email.should.eql('fsociety@gmail.com');
                res2.body.data.phone.should.eql(['01111225223']);
                res2.body.data.birthdate.should.eql('1997-07-29T21:00:00.000Z');
                done();
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
