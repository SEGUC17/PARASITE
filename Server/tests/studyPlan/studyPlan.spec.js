var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Content = mongoose.model('Content');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);


chai.use(chaiHttp);

// an array for insertions
var docArray = [];

// save the documents and test
var saveAllAndTest = function (done, requestUrl, pageLength) {
  var doc = docArray.pop();
  doc.save(function (err, saved) {
    if (err) {
      throw err;
    }
    if (docArray.length === 0) {
      chai.request(server).
        get(requestUrl).
        end(function (error, res) {
          if (error) {
            return console.log(error);
          }
          expect(res).to.have.status(200);
          res.body.data.docs.should.be.a('array');
          res.body.data.docs.should.have.lengthOf(pageLength);
          done();
        });
    } else {
      saveAllAndTest(done, requestUrl, pageLength);
    }
  });
};

// tests
describe('/GET/ Content Page', function () {
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


  it(
    'should list ALL publishedStudyPlans on /getPublishedStudyPlans',
    function (done) {
      chai.request(server).get('/api/getPublishedStudyPlans').
        end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();

          if (err) {
            console.log(err);
          }

        });

    }
  );

  // --- Mockgoose Termination --- //
  after(function (done) {
    mongoose.connection.close(function () {
      done();
    });
  });
  // --- End of "Mockgoose Termination" --- //
});
