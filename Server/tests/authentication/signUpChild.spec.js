
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

// --- Mockgoose Initiation --- //
describe('signUpChild', function () {
    this.timeout(120000);  
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

     it('signUp returns a 201 response', function(done)  {
    chai.request(server)
        .post('/api/signUp').send(user)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            Token = res.body.token;
            console.log('token is :' + Token);

            //my tests//
            chai.request(server).
                post('/api/childsignup').send({ username: 'nayeraa.zaghloul', password: 'nayeranayera1234', firstName: 'nayera', lastName: 'zaghloul', birthdate: '11/11/2016', email: 'nayerazaghloul12@gmail.com', phone: ['01120005030'], address: 'tagamo' }).
                set('Authorization', Token).end((error, response) => {
                    if (error) done(error);
                    // Now let's check our response
                    expect(response).to.have.status(201);
                    done();
                });  
           //   done();   
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

 //trial test
  /*
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
  */
//--end of tests--//
