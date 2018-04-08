var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var request = require('supertest');
var assert = chai.assert;

chai.use(chaiHttp);

process.env.NODE_ENV = "test";

const User = {
    username: 'ahmed1hisham',
    password: '123456789'
};

var token;

var authenticatedUser = request.agent(server);
before(function(done){
    authenticatedUser
        .post('/api/signIn')
        .send(User)
        .end(function(err, response){
            response.should.have.status(200);
            token = response.body.token;
            done();
        });
});

describe('Profile', function() {


  describe('Add as a parent', function() {
    it('should add the correct child to the children of the selected parent', function(done){

        authenticatedUser
        .post('/api/profile/LinkAnotherParent/5ac4758a9ef2841987327718')
        .send({
            child: 'Lara'
        })
        .set( 'Authorization', token )
        .end(function(err, res){
            console.log(res.body);
            should.exist(res);
            res.should.have.status(200);
        });
      done();
    });
  });



});
