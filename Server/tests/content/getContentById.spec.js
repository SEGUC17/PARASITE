var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Content = mongoose.model('Content');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

describe('/GET/ Content by id', function () {
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

    it('it should GET content from the server by id', function (done) {
        var cont1 = new Content({
            approved: true,
            body: '<h1>Hello</h1>',
            category: 'cat1',
            creator: 'Omar',
            section: 'sec1',
            title: 'Test Content'
        });

        cont1.save(function (err, savedContent) {
            if (err) {
                return console.log(err);
            }
            chai.request(server).get('/api/content/view/' + savedContent._id).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(200);
                    console.log(res.body.data);
                    res.body.data.should.be.a('Object');
                    res.body.data.should.have.
                        property(
                            'title',
                            'Test Content',
                            'Wrong content was retrieved'
                        );
                    res.body.data.should.have.
                        property(
                            '_id',
                            String(savedContent._id),
                            'Wrong content was retrieved.'
                        );
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
