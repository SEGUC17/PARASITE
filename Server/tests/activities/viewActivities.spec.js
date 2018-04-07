/* eslint-disable sort-keys */
/* eslint-disable guard-for-in */
/*eslint max-statements: ["error", 20]*/

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var Activity = mongoose.model('Activity');
// --- End of 'Requirements' --- //

// --- Dependancies --- //
var expect = chai.expect;
var should = chai.should();
var mockgoose = new Mockgoose(mongoose);
// --- End of 'Dependancies' --- //

// --- Middleware --- //
chai.use(chaiHttp);
// --- End of 'Middleware' --- //


describe('Activities', function () {
    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });
    // --- End of 'Mockgoose Initiation' --- //

    // --- Clearing Mockgoose --- //
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    // --- End of 'Clearing Mockgoose' --- //

    describe('/GET activities', function () {
        it('it should GET verified activities', function (done) {
            Activity.create({
                creator: 'username',
                name: 'activity1',
                description: 'activity1 des',
                fromDateTime: Date.now(),
                toDateTime: Date.now() + 5,
                status: 'pending',
                price: 50
            });
            Activity.create({
                creator: 'username',
                name: 'activity2',
                description: 'activity2 des',
                fromDateTime: Date.now(),
                toDateTime: Date.now() + 5,
                status: 'rejected',
                price: 50
            });
            Activity.create({
                creator: 'username',
                name: 'activity3',
                description: 'activity3 des',
                fromDateTime: Date.now(),
                toDateTime: Date.now() + 5,
                status: 'verified',
                price: 50
            });
            chai.request(app).get('/api/activities').
                end(function (err, res) {
                    // testing get activities for unverified user
                    if (err) {
                        console.log(err);
                    }
                    res.should.have.status(200);
                    console.log(res.body.data);
                    expect(res.body.data.total).to.equal(1);
                    expect(res.body.data).to.have.ownProperty('page');
                    expect(res.body.data).to.have.ownProperty('pages');
                    expect(res.body.data).to.have.ownProperty('limit');
                    var activities = res.body.data.docs;
                    for (var activity in activities) {
                        activity = activities[activity];
                        expect(activity.status).to.equal('verified');
                    }
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
});
