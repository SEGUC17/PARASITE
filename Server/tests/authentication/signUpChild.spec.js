
//-- requirements initiation---//

var expect = require('chai').expect;
var request = require('request');
var chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
var app = require('../../app');
var server = require('../../app');
var childsignup = require('../../api/controllers/UserController');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var User = require('../../api/models/User');
var mockgoose = new Mockgoose(mongoose);
var config = require('../../api/config/config');
var should = chai.should();
var Token = null;

//--end of requirements and vairiables initiation--//


// user for authentication
var user = {
    birthdate: '1/1/1980',
    email: 'mayasameh@gmail.com',
    firstName: 'mayar',
    lastName: 'sameh',
    password: '123456789',
    phone: '0112892201',
    username: 'mayar.sameh'
};
var child = { 
    username: 'nayeraa.zaghloul',
    password: 'nayeranayera1234',
    firstName: 'nayera',
    lastName: 'zaghloul',
    birthdate: '11/11/2016', 
    email: 'nayerazaghloul12@gmail.com',
    phone: ['01120005030'],
    address: 'tagamo'
     }

// --- Mockgoose Initiation --- //
describe('signUpChild', function () {
    this.timeout(1200000);
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

    it('Child Sign Up returns a 201 response', function (done) {
        chai.request(server)
            .post('/api/signUp').send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                Token = res.body.token;
              //  console.log('token is :' + Token);

                //my tests//
                chai.request(server).
                    post('/api/childsignup').send(child).
                    set('Authorization', Token).end((error, response) => {
                        if (error) done(error);
                        // Now let's check our response
                        expect(response).to.have.status(201);
                        response.body.data.should.be.a('Object');
                        response.body.should.have.property('msg').eql('Child Successfully Signed Up!');
                        response.body.data.should.have.property('username').eql(response.body.data.username);
                        response.body.data.should.have.property('password').eql(response.body.data.password);
                        response.body.data.should.have.property('birthdate').eql(response.body.data.birthdate);
                        response.body.data.should.have.property('email').eql(response.body.data.email);
                        response.body.data.should.have.property('firstName').eql(response.body.data.firstName);
                        response.body.data.should.have.property('lastName').eql(response.body.data.lastName);
                        response.body.data.should.have.property('phone').eql(response.body.data.phone);
                        response.body.data.should.have.property('address').eql(response.body.data.address);


                        done();
                    });
                //   done();   
            });
    });

    // empty birthdate case
    it('Token Expires In More Than 12 Hours!');
    it('Birthdate Attribute Is Empty!', function (done) {
        chai.request(server)
        .post('/api/signUp').send(user)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            Token = res.body.token;
    
        child.birthdate = null;
        chai.request(server).
            post('/api/childsignup').
            send(child).
            set('Autherization', Token).
            end((err1, res1) => {
                if (err1) done(err1);
                res1.should.have.status(401);
                res1.body.should.have.property('msg').eql('you are missing required data entry');
                
            });
         });
    done();
    });

// empty email case
    it('"email" Attribute Is Empty!', function (done) {
        chai.request(server)
        .post('/api/signUp').send(user)
        .end((err5, res5) => {
            res5.should.have.status(201);
            res5.body.should.be.a('object');
            res5.body.should.have.property('token');
            Token = res5.body.token;

            chai.request(server)
            .post('/api/signIn').send({ 'username': user.username, 'password': user.password})
            .end((err5, res5) => {
                res5.should.have.status(201);
                res5.body.should.be.a('object');
                res5.body.should.have.property('token');
                Token = res5.body.token;
        child.email = null;
        chai.request(server).
            post('/api/childsignup').
            send(child).
            set('Autherization', Token).
            end((err3, res3) => {
                if (err3) done(err3);
                res3.should.have.status(401);
                res3.body.should.have.property('msg').eql('you are missing required data entry');
                
            });
        });
    });
        done();

    });

// empty firstname case
/*  ---- to be continued
    it('"firstName" Attribute Is Empty!', function (done) {
        chai.request(server)
        .post('/api/signUp').send(user)
        .end((err7, res7) => {
            res7.should.have.status(201);
            res7.body.should.be.a('object');
            res7.body.should.have.property('token');
            Token = res7.body.token;

            chai.request(server)
            .post('/api/signIn').send({ 'username': user.username, 'password': user.password})
            .end((err7, res7) => {
                res7.should.have.status(201);
                res7.body.should.be.a('object');
                res7.body.should.have.property('token');
                Token = res7.body.token;
                
        child.firstName = null;
        chai.request(server).
            post('/api/childsignup').
            send(child).
            set('Autherization', Token).
            end((err10, res10) => {
                if (err10) done(err10);
                res10.should.have.status(401);
                res10.body.should.have.property('msg').eql('you are missing required data entry');
                
            });
        });
    });
       done();
    });
*/
    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //


});

 
//--end of tests--//
