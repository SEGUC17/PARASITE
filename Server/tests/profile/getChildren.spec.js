var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var User = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();
//var d ate= new Date("October 13, 2014 11:13:00");
chai.use(chaiHttp);
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var route = require('../../api/routes/index');

describe('/PATCH/ ChildrenIndependence', function () {
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
    // --- End of "Clearing Mockgoose" --- /

    //testing get children
 it('it should GET categories from the server', function (done) {
 var user1 = new User({
 address: 'Mars',
 birthdate: '1990-11-10T22:00:00.000Z',
 children: ['onechild'],
 email: 'haidy@gmail.com',
 firstName: 'haidy',
isParent: true,
 lastName: 'koko',
 password: '12345678',
 phone: '01213944266',
 username: 'heidi'
 });
 user1.save(function (err, savedCategory) {
 if (err) {
 return console.log(err);
 }
 chai.request(server).get('/api/profile/' + user1.username + '/getChildren').
 end(function (error, res) {
 if (error) {
 return console.log(error);
 }
 expect(res).to.have.status(200);
res.body.data.should.be.a('array');
res.body.should.have.property('msg').
        eql('Children retrieved successfully.');
        res.body.should.have.property('err').eql(null);
  res.body.should.have.property('data').eql(user1.children);
 done();
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

