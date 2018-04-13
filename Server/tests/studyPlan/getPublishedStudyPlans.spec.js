var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var StudyPlan = mongoose.model('StudyPlan');
var User = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
chai.use(chaiHttp);
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var studyPlan = new StudyPlan({
  creator: 'Jathri',
  description: '<p class="ql-align-center">' +
    '<span class="ql-size-large">' +
    'Are you ready to go on an adventure?</span></p>',
  events: [
    {
      _id: '5ac09ae2f538185d46efc8c4',
      actions: [],
      color: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
      },
      end: '2018-04-01T20:07:28.780Z',
      start: '2018-03-29T22:00:00.000Z',
      title: 'So Many Comebacks, So Little Time...'
    }
  ],
  title: 'The Ultimate Guide to KPop'
});

describe('/GET/ get published study plans', function () {
  this.timeout(1000000000);

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

  it('it should GET Published Study Plans', function (done) {
    chai.request(server).
      get('/api/study-plan/getPublishedStudyPlans' +
        '/:1').
      end(function (error, res) {
        if (error) {
          return console.log(error);
        }
        res.should.have.status(200);
        expect(res.body.data.docs.length).to.equal(0);
        expect(res.body.data).to.have.ownProperty('page');
        expect(res.body.data).to.have.ownProperty('pages');
        expect(res.body.data).to.have.ownProperty('limit');

        done();
      });
  });
  // --- Mockgoose Termination --- //
  after(function (done) {
    mongoose.connection.close(function () {
      done();
    });
    // --- End of "Mockgoose Termination" --- //
  });
});


