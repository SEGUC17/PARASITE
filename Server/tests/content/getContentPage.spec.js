var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Content = mongoose.model('Content');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);


chai.use(chaiHttp);

// an array for insertions
var docArray = [];

// save the documents and test
var saveAllAndTest = function (done, requestUrl, pageLength) {
    var doc = docArray.pop();
    doc.save(function (err) {
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

    it('it should GET page of content from the server ' +
        'with a specific category and section', function (done) {

            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat77',
                creator: 'Omar',
                section: 'sec1',
                title: 'Test Content'
            }));

            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new Content({
                    approved: true,
                    body: '<h1>Hello</h1>',
                    category: 'cat1',
                    creator: 'Omar',
                    section: 'sec1',
                    title: 'Test Content' + counter
                }));
            }

            saveAllAndTest(
                done,
                '/api/content/getContentPage/3/1/cat1/sec1',
                3
            );
        });

    it('it should GET page of content from the server ' +
        'with a specific category only', function (done) {

            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat77',
                creator: 'Omar',
                section: 'sec1',
                title: 'Test Content'
            }));

            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new Content({
                    approved: true,
                    body: '<h1>Hello</h1>',
                    category: 'cat1',
                    creator: 'Omar',
                    section: 'sec1',
                    title: 'Test Content' + counter
                }));
            }

            saveAllAndTest(
                done,
                '/api/content/getContentPage/3/1/cat1/NoSec',
                3
            );
        });

    it(
        'it should fail with 422 because parameters are not valid',
        function (done) {
            chai.request(server).
                get('/api/content/getContentPage/MyLifeIsAHHH/1/cat1/sec1').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(422);
                    done();
                });
        }
    );

    it('it should GET page of content from the server ' +
        'with no specific category or section', function (done) {

            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new Content({
                    approved: true,
                    body: '<h1>Hello</h1>',
                    category: 'cat' + counter,
                    creator: 'Omar',
                    section: 'sec1',
                    title: 'Test Content' + counter
                }));
            }

            saveAllAndTest(
                done,
                '/api/content/getContentPage/3/1/NoCat/NoSec',
                3
            );
        });
    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //
});
