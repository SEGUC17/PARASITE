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

describe('Unlink a child ', function () {
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

    it('remove the child from the children list of the parent', function (done) {
        var user = {
            birthdate: '7/7/1997',
            email: 'fsociety@gmail.com',
            firstName: 'Mr',
            isEmailVerified: true,
            lastName: 'Robot',
            password: '123456789',
            phone: '01111225223',
            username: 'fsociety'
        };
        var UserIn = {
            username: 'fsociety',
            password: '123456789'
        };

        User.create(user, function (err) {
            if (err) {
                done(err);
            }
                var authenticatedUser = request.agent(server);

                authenticatedUser.
                    post('/api/signIn').
                    send(UserIn).
                    end(function (err, response) {
                        response.should.have.status(200);
                        var token = response.body.token;
                        var array = [
                            '_id',
                            'username'
                        ];
                        if (err) {
                            console.log(err);
                        }

                        chai.request(server).
                            post('/api/userData').
                            send(array).
                            set('Authorization', token).
                            end(function (err, res) {
                                if (err) {
                                    console.log(err);
                                }
                                res.should.have.status(200);
                                var child1 = { child: 'Mariam' };
                                var child2 = { child: 'Nada' };
                                chai.request(server).
                                    put('/api/profile/AddAsAParent/' + res.body.data._id).
                                    send(child1).
                                    set('Authorization', token).
                                    end(function (error, res) {
                                        chai.request(server).
                                            put('/api/profile/AddAsAParent/' + res.body.data._id).
                                            send(child2).
                                            set('Authorization', token).
                                            end(function (error, res) {

                                                chai.request(server).
                                                    put('/api/profile/unLinkChild/' + res.body.data._id).
                                                    send(child1).
                                                    set('Authorization', token).
                                                    end(function (error, res) {
                                                        if (error) {
                                                            return console.log(error);
                                                        }
                                                        expect(res).to.have.status(200);
                                                        res.body.data.should.be.a('Object');
                                                        res.body.data.should.have.
                                                            property('children').eql(['Nada']);
                                                        res.body.data.should.have.
                                                            property('_id').eql(String(res.body.data._id));
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
