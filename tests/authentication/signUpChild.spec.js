
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
        // user for authentication
  this.user = {
    birthdate: '1/1/1980',
    email: 'lamaahmed166@gmail.com',
    isEmailVerified:true,
    firstName: 'lama',
    lastName: 'ahmed',
    password: '123456789',
    phone: '0112892201',
    username: 'lama.ahmed'
};
   this.child = { 
    username: 'nayeraa.zaghloul',
    password: 'nayeranayera1234',
    isEmailVerified:true,
    firstName: 'nayera',
    lastName: 'zaghloul',
    birthdate: '11/11/2016', 
    email: 'nayerazaghloul12@gmail.com',
    phone: ['01120005030'],
    address: 'tagamo'
     };
        mockgoose.helper.reset().then(function () {
          return  done();
        });
    });

    // --- End of "Clearing Mockgoose" --- //

    it('Child Sign Up returns a 201 response', function (done) {
               var that = this;
                User.create(this.user, function (err) {
                    if (err) {
                        return done(err);
                    }
                    console.log(that.user.username);
                chai.request(server)
                .post('/api/signIn')
                .send({'password' : that.user.password, 
                 'username': that.user.username })
                .end((err6, res6) => {
                    res6.should.have.status(200);
                    res6.body.should.be.a('object');
                  res6.body.should.have.property('token');
                  Token = res6.body.token;
              //  console.log('token is :' + Token);

                //my tests//
                chai.request(server).
                    post('/api/childsignup').send(that.child).
                    set('Authorization', Token).end((error, response) => {
                        if (error) done(error);
                        // Now let's check our response
                        expect(response).to.have.status(201);
                        response.body.should.be.a('Object');
                        response.body.should.have.property('msg').eql('Child Sign Up is Successful!\nVerification Mail Was Sent To Your Child\'s Email!');
                       return done();
                    });   
            });
         });
    });



    // empty birthdate case
    it('Token Expires In More Than 12 Hours!');
    it('Birthdate Attribute Is Empty!', function (done) {
        var that = this;
        User.create(this.user, function (err) {
            if (err) {
                return done(err);
            }
        chai.request(server)
        .post('/api/signIn')
        .send({'password' : that.user.password, 
         'username': that.user.username })
        .end((err4, res4) => {
            res4.should.have.status(200);
            res4.body.should.be.a('object');
          res4.body.should.have.property('token');
          Token = res4.body.token;
          //birthdate is null
         that.child.birthdate = null;
        chai.request(server).
            post('/api/childsignup').
            send(that.child).
            set('Autherization', Token).
            end((err1, res1) => {
                if (err1) done(err1);
                res1.should.have.status(401);
              //  res1.body.should.have.property('msg').eql('you are missing required data entry');
                 return done();
            });
         });
        });
    });

// empty email case
    it('"email" Attribute Is Empty!', function (done) {

        var that = this;
        User.create(this.user, function (err) {
            if (err) {
                return done(err);
            }
            chai.request(server)
            .post('/api/signIn').send({ 'username': that.user.username,
             'password': that.user.password
            }).end((err9, res9) => {
                res9.should.have.status(200);
                res9.body.should.be.a('object');
                res9.body.should.have.property('token');
                Token = res9.body.token;
        that.child.email = null;
        chai.request(server).
            post('/api/childsignup').
            send(that.child).
            set('Autherization', Token).
            end((err3, res3) => {
                if (err3) done(err3);
                res3.should.have.status(401);
            //    res3.body.should.have.property('msg').eql('you are missing required data entry');
                return done();

            });
        });
    });

    });

// empty firstname case
// ---- to be continued
    it('"firstName" Attribute Is Empty!', function (done) {
             var that = this;
             User.create(this.user, function (err) {
                if (err) {
                    return done(err);
                }
            chai.request(server)
            .post('/api/signIn').send({ 'username': that.user.username,
             'password': that.user.password})
            .end((err8, res8) => {
                res8.should.have.status(200);
                res8.body.should.be.a('object');
                res8.body.should.have.property('token');
                Token = res8.body.token;
                
        that.child.firstName = null;
        chai.request(server).
            post('/api/childsignup').
            send(that.child).
            set('Autherization', Token).
            end((err10, res10) => {
                if (err10) done(err10);
                res10.should.have.status(401);
              //  res10.body.should.have.property('msg').eql('you are missing required data entry');
                   return done();
                
            });
        });
    });
    });
    /*
    it('"Email format is incorrect!', function (done) {
        var that = this;
        User.create(this.user, function (err) {
           if (err) {
               return done(err);
           }
       chai.request(server)
       .post('/api/signIn').send({ 'username': that.user.username,
        'password': that.user.password})
       .end((err8, res8) => {
           res8.should.have.status(200);
           res8.body.should.be.a('object');
           res8.body.should.have.property('token');
           Token = res8.body.token;
           
   that.child.email = 'nayera@gmailcom';
   console.log('username is before wrong email check', that.child.username);
   chai.request(server).
       post('/api/childsignup').
       send(that.child).
       set('Autherization', Token).
       end((err11, res11) => {
           if (err11) done(err11);
           res11.should.have.status(422);
         //  res10.body.should.have.property('msg').eql('you are missing required data entry');
              return done();
           
       });
   });
});
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
