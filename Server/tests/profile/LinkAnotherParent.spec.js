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

    it('it should add the current child to the chosen user,' +
        ' and make this user a parent', function (done) {
            var user = {
                birthdate: '1/1/1997',
                email: 'Magicx@gmail.com',
                firstName: 'Omar',
                lastName: 'Omar',
                password: '123456789',
                phone: '01111111111',
                username: 'snickers123'
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
                                    var child = { child: 'Mohamed' };
                                    // the test
                                    chai.request(server).
                                        put('/api/profile/LinkAnotherParent/' +
                                            res.body.data._id).
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
                                                property('children').
                                                eql(['Mohamed']);
                                            Response.body.data.should.have.
                                                property('isParent').eql(true);
                                            Response.body.data.should.have.
                                                property('_id').
                                                eql(String(Response.body.
                                                    data._id));
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
