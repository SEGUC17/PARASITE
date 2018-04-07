//-- requirements initiation---//

var expect = require('chai').expect;
var request = require('request');
var chai=require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
var app= require('../../app');
var childsignup= require('../../api/controllers/UserController');
var http = require('http').createServer(app).listen(3000);
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var User = require('../../api/models/User');
var mockgoose = new Mockgoose(mongoose);
var should = chai.should();
var Token = null;
 
//--end of requirements and vairiables initiation--//




   // --- Mockgoose Initiation --- //
   describe('signUpChild', function(){
      before(function (done) {
        mockgoose.prepareStorage().then(function () {
        mongoose.connect(config.MONGO_URI, function () {
            done();
        });
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

  before(function(done) {
    chai.request('http://localhost:3000')
      .post('/api/signIn').send({username:'pery.ashraf' , password: 'perypery1234' })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
       //   res.body.should.have.property('password');
         // res.body.should.have.property('username');
          res.body.should.have.property('token');
          Token= res.body.token;
        console.log('token is :' +Token);
        done();
      });
  });
describe('Status of childSignUp', function () {
    describe('ChildSignUP page', function () {
        it('Returns a 200 response', (done) => {
            chai.request('http://localhost:3000').
            post('/api/childsignup').send({username: 'yomna.karefsn', password: 'yomnayomnal1234', firstName: 'yomna', lastName: 'karefsn', birthdate: '11/11/2016', email: 'yomnakarefsn@gmail.com', phone: ['01120005030'], address: 'tagamo'}).set('Authorization', Token).end((error, response) => {
                if (error) done(error);
                // Now let's check our response
                expect(response).to.have.status(201);
                done();
            });
        });
        });
    });


describe('Hello World Route', () => {
    it('Returns a 200 response', (done) => {
        chai.request(app)
            .get('/api/')
            .end((error, response) => {
                if (error) done(error);
                // Now let's check our response
                expect(response).to.have.status(200);
                done();
            });
    });

});

                    //--end of tests--//

 // --- Mockgoose Termination --- //
 after(function (done) {
    mongoose.connection.close(function () {
        done();
    });
});
// --- End of "Mockgoose Termination" --- //