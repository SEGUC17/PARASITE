var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
//var User = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var request = require('supertest');

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);


chai.use(chaiHttp);

// user for authentication
var user = {
    birthdate: '1/1/1980',
    children: [
        'Ahmed',
        'Omar'
    ],
    email: 'omar@omar.omar',
    firstName: 'omar',
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
};
var UserIn = {
    password: '123456789',
    username: 'omar'
};
// authenticated token
var token = null;

describe('unlink my child', function () {

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

    it('it should remove the child from the children list', function (done) {
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
                        var array = [
                            '_id',
                            'username'
                        ];
                        //Gitting the user info
                        chai.request(server).
                            post('/api/userData').
                            send(array).
                            set('Authorization', token).
                            end(function (Err, Res) {
                                Res.should.have.status(200);
                                var child = { child: 'Omar' };
                                //the test
                                chai.request(server).
                                    put('/api/profile/Unlink/' +
                                        Res.body.data._id).
                                    send(child).
                                    set('Authorization', token).
                                    end(function (Error, Response) {
                                        if (Error) {
                                            return console.log(Error);
                                        }
                                        expect(Response).to.have.
                                            status(200);
                                        Response.body.data.should.
                                            be.a('Object');
                                        Response.body.data.should.have.
                                            property('children').not.
                                            eql(['Omar']);
                                        Response.body.data.should.have.
                                            property('isParent').eql(true);
                                        Response.body.data.should.have.
                                            property('_id').
                                            eql(String(Response.body.data.
                                                _id));
                                        done();
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
