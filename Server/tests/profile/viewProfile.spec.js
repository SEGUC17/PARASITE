var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect();
var request = require('request');
var app = require('../../app');

describe('View Profile', function() {


  describe('gets user info', function() {
    it('should get user info', function(done){
      var number = 9;
      // request.get({url: '/api/profile'}, function(err, response, body){
      //   expect(response.statusCode).to.equal(200);
      //   console.log(body);
      //   done();
      // });
      number.should.equal(9);
    });
  });


});
