/*eslint max-statements: ["error", 20]*/
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Psychologist = mongoose.model('Psychologist');
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
describe('/GET/ Psychologists Page', function () {
    this.timeout(1200000);

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

    it('it should GET page of psychologists from the server ' +
        'with a first or last name that' +
        'matches the given name', function (done) {

            docArray.push(new Psychologist({
                address: 'cairo',
                daysOff: [],
                email: 'name@name.name',
                firstName: 'fn',
                lastName: 'ln',
                phone: '0111',
                priceRange: 150
            }));
            docArray.push(new Psychologist({
                address: 'cairo',
                daysOff: [],
                email: 'name@name.name',
                firstName: 'ln',
                lastName: 'fn',
                phone: '0111',
                priceRange: 150
            }));

            for (var counter = 0; counter < 5; counter += 1) {
                docArray.push(new Psychologist({
                    address: 'cairo',
                    daysOff: [],
                    email: 'name@name.name',
                    firstName: 'fn' + counter,
                    lastName: 'ln',
                    phone: '0111',
                    priceRange: 150
                }));
            }
            var limiters = {
                entriesPerPage: 5,
                pageNumber: 1,
                search: 'fn'
            };
            saveAllAndTest(
                done,
                '/api/psychologist/search/' + JSON.stringify(limiters),
                2
            );
        });

    it('it should GET page of psychologists from the server ' +
        'with no restrictions', function (done) {
            docArray.push(new Psychologist({
                address: 'cairo',
                daysOff: [],
                email: 'name@name.name',
                firstName: 'fn',
                lastName: 'ln',
                phone: '0111',
                priceRange: 150
            }));
            docArray.push(new Psychologist({
                address: 'cairo',
                daysOff: [],
                email: 'name@name.name',
                firstName: 'ln',
                lastName: 'fn',
                phone: '0111',
                priceRange: 150
            }));

            for (var counter = 0; counter < 5; counter += 1) {
                docArray.push(new Psychologist({
                    address: 'cairo',
                    daysOff: [],
                    email: 'name@name.name',
                    firstName: 'fn' + counter,
                    lastName: 'ln',
                    phone: '0111',
                    priceRange: 150
                }));
            }
            var limiters = {
                entriesPerPage: 5,
                pageNumber: 1
            };
            saveAllAndTest(
                done,
                '/api/psychologist/search/' + JSON.stringify(limiters),
                5
            );
        });
    it('it should GET page of psychologists from the server with address' +
        ' matching the given address (partially or totally)', function (done) {
            docArray.push(new Psychologist({
                address: 'cairo',
                daysOff: [],
                email: 'name@name.name',
                firstName: 'fn',
                lastName: 'ln',
                phone: '0111',
                priceRange: 150
            }));

            for (var counter = 0; counter < 5; counter += 1) {
                docArray.push(new Psychologist({
                    address: 'cairo' + counter,
                    daysOff: [],
                    email: 'name@name.name',
                    firstName: 'fn',
                    lastName: 'ln',
                    phone: '0111',
                    priceRange: 150
                }));
            }
            var limiters = {
                address: 'Cairo',
                entriesPerPage: 5,
                pageNumber: 1
            };
            saveAllAndTest(
                done,
                '/api/psychologist/search/' + JSON.stringify(limiters),
                5
            );
        });
    it('it should GET page of psychologists from the server ' +
        ' sorted with ascending price', function (done) {

            for (var counter = 0; counter < 5; counter += 1) {
                docArray.push(new Psychologist({
                    address: 'cairo',
                    daysOff: [],
                    email: 'name@name.name',
                    firstName: 'fn',
                    lastName: 'ln',
                    phone: '0111',
                    priceRange: counter
                }));
            }
            var limiters = {
                entriesPerPage: 5,
                pageNumber: 1,
                sort: 'cheapest'
            };
            saveAllAndTest(
                done,
                '/api/psychologist/search/' + JSON.stringify(limiters),
                5
            );
        });
    it('it should GET page of psychologists from the server ' +
        ' sorted lexographically', function (done) {
            for (var counter = 0; counter < 5; counter += 1) {
                docArray.push(new Psychologist({
                    address: 'cairo',
                    daysOff: [],
                    email: 'name@name.name',
                    firstName: String(counter) + 'fn',
                    lastName: 'ln',
                    phone: '0111',
                    priceRange: 150
                }));
            }
            var limiters = {
                entriesPerPage: 5,
                pageNumber: 1,
                sort: 'a-z'
            };
            saveAllAndTest(
                done,
                '/api/psychologist/search/' + JSON.stringify(limiters),
                5
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
