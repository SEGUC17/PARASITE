var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Content = mongoose.model('Content');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = require('chai').should();
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
            counter < res.body.data.contents.docs.length;
            counter += 1
        ) {
            res.body.data.contents.docs[counter].
                should.have.property('category', expectedCategory);
            res.body.data.contents.docs[counter].
                should.have.property('section', expectedSection);
        }
    }
};

var validateSearchQueryMatch = function (searchQuery, res) {
    var counter = 0;

    // skip if there was not search query
    if (searchQuery !== '') {

        // check that all the docs satisfy the query
        for (
            counter = 0;
            counter < res.body.data.contents.docs.length;
            counter += 1
        ) {
            res.body.data.
                contents.docs[counter].should.satisfy(function (content) {
                    var splitSearchQuery = searchQuery.split(' ');
                    var secondCounter = 0;
                    var splitTitle = content.title.split(' ');

                    // return true if the tags
                    // contain a part of the search query
                    for (secondCounter = 0;
                        secondCounter < splitSearchQuery.length;
                        secondCounter += 1) {
                        if (
                            content.tags.
                                indexOf(splitSearchQuery[secondCounter]) > -1
                        ) {
                            return true;
                        }
                    }

                    // return true if the title
                    // contains a part of the search query
                    for (secondCounter = 0;
                        secondCounter < splitSearchQuery.length;
                        secondCounter += 1) {
                        if (
                            splitTitle.
                                indexOf(splitSearchQuery[secondCounter]) > -1
                        ) {
                            return true;
                        }
                    }

                    // return false if neither the title nor
                    // the tags of the doc match the query
                    return false;
                });
        }
    }
};

// ensure the sort order
var validateSortBy = function (sortBy, res) {
    if (sortBy !== '') {
        res.body.data.contents.docs.should.satisfy(function (docs) {
            var counter = 0;
            for (
                counter = 0;
                counter < docs.length - 1;
                counter += 1
            ) {
                // sort was by upload date
                if (sortBy === 'upload date') {
                    if (docs[counter].touchDate < docs[counter + 1].touchDate) {
                        return false;
                    }
                }
                // sort was by rating
                if (sortBy === 'rating') {
                    if (docs[counter].rating < docs[counter + 1].rating) {
                        return false;
                    }
                }
            }
            // all docs matched

            return true;
        });
    }
};

// save the documents and test
var saveAllAndTest = function (
    done,
    requestUrl,
    pageLength,
    expectedCategory,
    expectedSection,
    searchQuery,
    sortBy
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
                    res.body.data.contents.docs.should.be.a('array');
                    res.body.data.
                        contents.docs.should.have.lengthOf(pageLength);
                    valiateCategoryAndSection(
                        expectedCategory,
                        expectedSection,
                        res
                    );
                    validateSearchQueryMatch(
                        searchQuery,
                        res
                    );
                    validateSortBy(
                        sortBy,
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
                expectedSection,
                searchQuery,
                sortBy
            );
        }
    });
};

var runValidityTests = function () {
    it(
        'it should fail with 422 because page number is not valid',
        function (done) {
            chai.request(server).
                get('/api/content/3/' +
                    'number/search?searchQuery=' +
                    '&sort=relevance&category=cat1&section=sec1').
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
                get('/api/content/number/' +
                    '1/search?searchQuery=' +
                    '&sort=relevance&category=cat1&section=sec1').
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
                get('/api/content/3/' +
                    '1/search?' +
                    '&sort=relevance&category=cat1&section=sec1').
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
                get('/api/content/3/' +
                    '1/search?searchQuery=' +
                    '&category=cat1&section=sec1').
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
                get('/api/content/3/' +
                    '1/search?searchQuery=' +
                    '&sort=relevance&section=sec1').
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
                get('/api/content/3/' +
                    '1/search?searchQuery=' +
                    '&sort=relevance&category=cat1').
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

// tests without a search query
var runNoQueryTests = function () {

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
                '/api/content/3/1/search?searchQuery=' +
                '&sort=relevance&category=cat1&section=sec1',
                3,
                'cat1',
                'sec1',
                '',
                ''
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
                '/api/content/3/1/search?searchQuery=' +
                '&sort=relevance&category=&section=',
                3,
                '',
                '',
                '',
                ''
            );
        });
};

var runQueryTests = function () {
    // test that the content with tags or title 'Test' are retrieved
    it('it should GET page of content from the server ' +
        'with a specific search query', function (done) {
            // add to the array content that will not be retrieved
            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat77',
                creator: 'Omar',
                section: 'sec77',
                title: 'No Retrieval Content'
            }));

            // add to the array content that will be retrieved from title
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new Content({
                    approved: true,
                    body: '<h1>Hello</h1>',
                    category: 'cat1',
                    creator: 'Omar',
                    section: 'sec1',
                    title: 'Test ' + counter
                }));
            }

            // add to the array content that will be retrieved from tags
            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat77',
                creator: 'Omar',
                section: 'sec77',
                tags: ['Test'],
                title: 'Retrieval Tags Content'
            }));

            // save the docs and perform the test
            saveAllAndTest(
                done,
                '/api/content/5/1/search?searchQuery=Test' +
                '&sort=relevance&category=&section=',
                4,
                '',
                '',
                'Test',
                ''
            );
        });

    // test that the content with tags or title 'nothing' are retrieved
    it('it should GET nothing from the server ' +
        'with a specific search query', function (done) {
            // add to the array content that will not be retrieved
            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat77',
                creator: 'Omar',
                section: 'sec77',
                title: 'No Retrieval Content'
            }));

            // add to the array content that will be retrieved from title
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new Content({
                    approved: true,
                    body: '<h1>Hello</h1>',
                    category: 'cat1',
                    creator: 'Omar',
                    section: 'sec1',
                    title: 'Test ' + counter
                }));
            }

            // add to the array content that will be retrieved from tags
            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat77',
                creator: 'Omar',
                section: 'sec77',
                tags: ['Test'],
                title: 'Retrieval Tags Content'
            }));

            // save the docs and perform the test
            saveAllAndTest(
                done,
                '/api/content/5/1/search?searchQuery=nothing' +
                '&sort=relevance&category=&section=',
                0,
                '',
                '',
                'Test',
                ''
            );
        });
};

var runSortTests = function () {
    // test that the content with tags or title 'Test' are retrieved
    // sorted by date
    it('it should GET page of content from the server ' +
        'with sort by date', function (done) {
            // add to the array content that will not be retrieved
            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat77',
                creator: 'Omar',
                section: 'sec77',
                title: 'No Retrieval Content'
            }));

            // add to the array content that will be retrieved from title
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new Content({
                    approved: true,
                    body: '<h1>Hello</h1>',
                    category: 'cat1',
                    creator: 'Omar',
                    section: 'sec1',
                    title: 'Test ' + counter
                }));
            }

            // add to the array content that will be retrieved from tags
            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat77',
                creator: 'Omar',
                section: 'sec77',
                tags: ['Test'],
                title: 'Retrieval Tags Content'
            }));

            // save the docs and perform the test
            saveAllAndTest(
                done,
                '/api/content/5/1/search?searchQuery=Test' +
                '&category=&section=&sort=upload date',
                4,
                '',
                '',
                'Test',
                'upload date'
            );
        });

    // test that the content with tags or title 'Test' are retrieved
    // sorted by rating
    it('it should GET page of content from the server ' +
        'with sort on rating', function (done) {
            // add to the array content that will not be retrieved
            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat77',
                creator: 'Omar',
                rating: 5,
                section: 'sec77',
                title: 'No Retrieval Content'
            }));

            // add to the array content that will be retrieved from title
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new Content({
                    approved: true,
                    body: '<h1>Hello</h1>',
                    category: 'cat1',
                    creator: 'Omar',
                    rating: counter,
                    section: 'sec1',
                    title: 'Test ' + counter
                }));
            }

            // add to the array content that will be retrieved from tags
            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat77',
                creator: 'Omar',
                rating: 3,
                section: 'sec77',
                tags: ['Test'],
                title: 'Retrieval Tags Content'
            }));

            // save the docs and perform the test
            saveAllAndTest(
                done,
                '/api/content/5/1/search?searchQuery=Test' +
                '&category=&section=&sort=rating',
                4,
                '',
                '',
                'Test',
                'rating'
            );
        });
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
            Content.ensureIndexes(function () {
                done();
            });
        });
    });
    // --- End of "Clearing Mockgoose" --- //
    // run tests with no search query provided
    runNoQueryTests();

    // run tests with a search query provided
    runQueryTests();

    // run tests with a sort included
    runSortTests();

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
