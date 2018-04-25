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

var token = null;
var user1 = {
    address: 'rehab',
    birthdate: '1/1/1997',
    email: 'magicx@gmail.com',
    firstName: 'omar',
    id: '',
    isEmailVerified: true,
    lastName: 'omar',
    password: '123456789',
    phone: '01111111111',
    username: 'snickers123'
};
var user2 = {
    address: 'rehab',
    birthdate: '10/10/1997',
    email: 'lama@gmail.com',
    firstName: 'lama',
    isEmailVerified: true,
    lastName: 'ahmed',
    password: '123456789',
    phone: '01111111111',
    username: 'lama'
};
var AUser1 = {
    address: 'rehab',
    birthdate: '1/1/1997',
    email: 'lama@gmail.com',
    firstName: 'Omar',
    lastName: 'Omar',
    password: '123456789',
    phone: '01111111111',
    username: 'snickers123'
};
var BUser1 = {
    address: 'cairo',
    birthdate: '5/5/1990',
    email: 'magicxx@gmail.com',
    firstName: 'omar',
    lastName: 'osama',
    phone: '0122222222',
    username: 'lama'
};
var CUser1 = {
    address: 'london el door el tani',
    birthdate: '7/7/1990',
    email: 'magicmagic@gmail.com',
    firstName: 'omar',
    lastName: 'osama',
    phone: '01277777777',
    username: 'omarosama123'
};

var UserIn = {
    password: '123456789',
    username: 'snickers123'
};


describe('Change my personal information', function () {
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
        User.create(user2, function (err5) {
            if (err5) {
                done(err5);
            }
            User.create(user1, function (err4) {
                if (err4) {
                    done(err4);
                }
                        var authenticatedUser = request.agent(server);
                        // Sign in
                        authenticatedUser.
                            post('/api/signIn').
                            send(UserIn).
                            end(function (error, res) {
                                res.should.have.status(200);
                                token = res.body.token;
                                //get the user info
                                chai.request(server).
                                    post('/api/userData').
                                    send(['_id']).
                                    set('Authorization', token).
                                    end(function (Err, Res) {
                                        Res.should.have.status(200);
                                        user1.id = Res.body.data._id;
                                        done();
                                    });
                            });
                    });
            });
    });

    it('It should change my personal information', function (done) {
        chai.request(server).
            patch('/api/profile/ChangeInfo/' +
                user1.id).
            send(CUser1).
            set('Authorization', token).
            end(function (Error, Response) {
                if (Error) {
                    return console.log(Error);
                }
                expect(Response).to.have.
                    status(200);
                Response.body.data.should.have.
                    property('address').
                    eql('london el door el tani');
                Response.body.data.should.have.
                    property('email').
                    eql('magicmagic@gmail.com');
                Response.body.data.should.have.
                    property('birthdate').
                    eql('1990-07-06T21:00:00.000Z');
                Response.body.data.should.have.
                    property('lastName').
                    eql('osama');
                Response.body.data.should.have.
                    property('phone').
                    eql(['01277777777']);
                Response.body.data.should.have.
                    property('username').
                    eql('omarosama123');

                done();
            });
    });
   // --------------------------------------------------------------------------
    it('It should not allow duplicate username', function (done) {
        chai.request(server).
            patch('/api/profile/ChangeInfo/' +
                user1.id).
            send(BUser1).
            set('Authorization', token).
            end(function (Error, Response) {
                if (Error) {
                    return console.log(Error);
                }
                expect(Response).to.have.
                    status(403);
                Response.body.msg.should.eql('Username already exists.');

                done();
            });
    });
    it('It should not allow duplicate email', function (done) {
        chai.request(server).
            patch('/api/profile/ChangeInfo/' +
                user1.id).
            send(AUser1).
            set('Authorization', token).
            end(function (Error, Response) {
                if (Error) {
                    return console.log(Error);
                }
                expect(Response).to.have.
                    status(403);
                Response.body.msg.should.eql('Email already exists.');


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
