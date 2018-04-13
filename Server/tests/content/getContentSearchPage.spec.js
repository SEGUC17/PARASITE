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

var valiateCategoryAndSection = function (
    expectedCategory,
    expectedSection,
    res
) {
    var counter = 0;
    // validate category and section retrieval
    if (expectedCategory !== '' &&
        expectedSection !== '') {
        // check category and section
        for (
            counter = 0;
            counter < res.body.data.docs.length;
            counter += 1
        ) {
            res.body.data.docs[counter].
                should.have.property('category', expectedCategory);
            res.body.data.docs[counter].
                should.have.property('section', expectedSection);
        }
    }
};

// save the documents and test
var saveAllAndTest = function (
    done,
    requestUrl,
    pageLength,
    expectedCategory,
    expectedSection
) {
    // get document from the array
    var doc = docArray.pop();
    // save the document
    doc.save(function (err) {
        if (err) {
            throw err;
        }
        // if this is the last document, run the test
        if (docArray.length === 0) {
            chai.request(server).
                get(requestUrl).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }

                    // expect status 200, an array result,
                    // and a length matching the page length
                    expect(res).to.have.status(200);
                    res.body.data.docs.should.be.a('array');
                    res.body.data.docs.should.have.lengthOf(pageLength);
                    valiateCategoryAndSection(
                        expectedCategory,
                        expectedSection,
                        res
                    );
                    done();
                });
        } else {
            // if it is not the last document, continue to save
            saveAllAndTest(
                done,
                requestUrl,
                pageLength,
                expectedCategory,
                expectedSection
            );
        }
    });
};

var runValidityTests = function () {
    it(
        'it should fail with 422 because page number is not valid',
        function (done) {
            chai.request(server).
                get('/api/content/getContentPage/3/' +
                    'number/search?searchQuery=""' +
                    '&sort="relevance"&category="cat1"&section="sec1"').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    // expect error status
                    expect(res).to.have.status(422);
                    done();
                });
        }
    );
    it(
        'it should fail with 422 because page size is not valid',
        function (done) {
            chai.request(server).
                get('/api/content/getContentPage/number/' +
                    '1/search?searchQuery=""' +
                    '&sort="relevance"&category="cat1"&section="sec1"').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    // expect error status
                    expect(res).to.have.status(422);
                    done();
                });
        }
    );
    it(
        'it should fail with 422 because searchQuery is not provided',
        function (done) {
            chai.request(server).
                get('/api/content/getContentPage/3/' +
                    '1/search?' +
                    '&sort="relevance"&category="cat1"&section="sec1"').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    // expect error status
                    expect(res).to.have.status(422);
                    done();
                });
        }
    );
    it(
        'it should fail with 422 because sort is not provided',
        function (done) {
            chai.request(server).
                get('/api/content/getContentPage/3/' +
                    '1/search?searchQuery=""' +
                    '&category="cat1"&section="sec1"').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    // expect error status
                    expect(res).to.have.status(422);
                    done();
                });
        }
    );
    it(
        'it should fail with 422 because category is not provided',
        function (done) {
            chai.request(server).
                get('/api/content/getContentPage/3/' +
                    '1/search?searchQuery=""' +
                    '&sort="relevance"&section="sec1"').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    // expect error status
                    expect(res).to.have.status(422);
                    done();
                });
        }
    );
    it(
        'it should fail with 422 because page size is not valid',
        function (done) {
            chai.request(server).
                get('/api/content/getContentPage/3/' +
                    '1/search?searchQuery=""' +
                    '&sort="relevance"&category="cat1"').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    // expect error status
                    expect(res).to.have.status(422);
                    done();
                });
        }
    );
};

// tests
describe('/GET/ Content Search Page', function () {

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

    // test that the content with a specific section and category is retrieved
    it('it should GET page of content from the server ' +
        'with a specific category and section', function (done) {
            // add to the array content that will not be retrieved
            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat77',
                creator: 'Omar',
                section: 'sec77',
                title: 'Test Content'
            }));

            // add to the array content that will be retrieved
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

            // save the docs and perform the test
            saveAllAndTest(
                done,
                '/api/content/getContentPage/3/1/search?searchQuery=""' +
                '&sort="relevance"&category="cat1"&section="sec1"',
                3,
                'cat1',
                'sec1'
            );
        });

    // test that a page of content will be retrieved from the server
    // without category or section
    it('it should GET page of content from the server ' +
        'with no specific category or section', function (done) {
            // add data that will be retrieved
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
            // save the docs and test
            saveAllAndTest(
                done,
                '/api/content/getContentPage/3/1/search?searchQuery=""' +
                '&sort="relevance"&category=""&section=""',
                3,
                '',
                ''
            );
        });

    // test that the server will send an error when parameters are invalid
    runValidityTests();

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //
});
