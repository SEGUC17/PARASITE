var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Category = mongoose.model('Category');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

describe('/GET/ Category', function () {
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

    it('it should GET categories from the server', function (done) {
        var cat1 = new Category({
            name: 'testcat1',
            sections: [{ name: 'sec1.1' }]
        });

        cat1.save(function (err, savedCategory) {
            if (err) {
                return console.log(err);
            }
            chai.request(server).get('/api/content/category/').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.data[0].should.have.
                        property('name', 'testcat1', 'category name invalid');
                    res.body.data[0].should.have.property('sections');
                    done();
                });
        });
    });

    it('it should get an empty array from ' +
        'the server when there are no categories', function (done) {
            chai.request(server).get('/api/content/category/').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.data.should.have.lengthOf(0);
                    done();
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
