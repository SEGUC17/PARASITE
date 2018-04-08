/*eslint max-statements: ["error", 20]*/
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Product = mongoose.model('Product');
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
describe('/GET/ Market Page', function () {
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

    it('it should GET page of products from the server ' +
        'with a name that partially or totally' +
        'matches the given name and price less' +
        ' than given price', function (done) {

            docArray.push(new Product({
                acquiringType: 'sell',
                describtion: 'a product',
                name: 'The new Product',
                price: 150,
                seller: 'nesrin'
            }));

            for (var counter = 0; counter < 5; counter += 1) {
                docArray.push(new Product({
                    acquiringType: 'sell',
                    describtion: 'a product',
                    name: 'The new Product',
                    price: 100,
                    seller: 'nesrin'
                }));
            }
            var limiters = {
                name: 'The new',
                price: 101
            };
            saveAllAndTest(
                done,
                '/api/market/getMarketPage/5/1/' + JSON.stringify(limiters),
                5
            );
        });

    it('it should GET page of products from the server ' +
        'using the name only', function (done) {
            docArray.push(new Product({
                acquiringType: 'sell',
                describtion: 'a product',
                name: 'not included product',
                price: 100,
                seller: 'nesrin'
            }));

            for (var counter = 0; counter < 5; counter += 1) {
                docArray.push(new Product({
                    acquiringType: 'sell',
                    describtion: 'a product',
                    name: 'The new Product',
                    price: counter,
                    seller: 'nesrin'
                }));
            }
            var limiters = { name: 'The new' };
            saveAllAndTest(
                done,
                '/api/market/getMarketPage/5/1/' + JSON.stringify(limiters),
                5
            );
        });
    it('it should GET page of market from the server ' +
        'with no specific name or price', function (done) {
            for (var counter = 0; counter < 5; counter += 1) {
                docArray.push(new Product({
                    acquiringType: 'sell',
                    describtion: 'a product',
                    name: 'The new Product' + counter,
                    price: counter,
                    seller: 'nesrin'
                }));
            }
            var limiters = {};
            saveAllAndTest(
                done,
                '/api/market/getMarketPage/5/1/' + JSON.stringify(limiters),
                5
            );
        });
    it('it should GET page of market from the server ' +
        'with a specific seller', function (done) {
            docArray.push(new Product({
                acquiringType: 'sell',
                describtion: 'a product',
                name: 'The new Product',
                price: 3,
                seller: 'notnesrin'
            }));
            for (var counter = 0; counter < 5; counter += 1) {
                docArray.push(new Product({
                    acquiringType: 'sell',
                    describtion: 'a product',
                    name: 'The new Product' + counter,
                    price: counter,
                    seller: 'nesrin'
                }));
            }
            var limiters = { seller: 'nesrin' };
            saveAllAndTest(
                done,
                '/api/market/getMarketPage/5/1/' + JSON.stringify(limiters),
                5
            );
        });
    it(
        'it should fail with 422 because entriesPerPage is not a number',
        function (done) {
            var limiters = {};
            chai.request(server).
                get('/api/market/getMarketPage/wrongType/1/' +
                    JSON.stringify(limiters)).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(422);
                    done();
                });
        }
    );
    it(
        'it should fail with 422 because pageNumber is not a number',
        function (done) {
            var limiters = {};
            chai.request(server).
                get('/api/market/getMarketPage/5/pageNumber/' +
                    JSON.stringify(limiters)).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(422);
                    done();
                });
        }
    );
    it(
        'it should fail with 422 because name is not a string',
        function (done) {
            var limiters = { name: 123 };
            chai.request(server).
                get('/api/market/getMarketPage/5/1/' +
                    JSON.stringify(limiters)).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(422);
                    done();
                });
        }
    );
    it(
        'it should fail with 422 because price is not a number',
        function (done) {
            var limiters = { price: 'not a number' };
            chai.request(server).
                get('/api/market/getMarketPage/5/1/' +
                    JSON.stringify(limiters)).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(422);
                    done();
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
