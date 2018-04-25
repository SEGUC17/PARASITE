
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();
var User = require('../../api/models/User');
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
chai.use(chaiHttp);
// user for authentication
var user = new User({
    address: 'cairo',
    birthdate: '01/01/1997',
    email: 'bla@bla.a',
    firstName: 'bla',
    isChild: false,
    isEmailVerified: true,
    lastName: 'mo',
    password: '123bla456bla',
    username: 'ol'
});
// authenticated token
var token = user;
// an array for insertions of test data
var docArray = [];
// save the documents and test
var saveAllAndTest = function (done, requestUrl, pageLength) {
    var doc = docArray.pop();
    doc.save(function (err, saved) {
        if (err) {
            throw err;
        }
        // all the documents were saved
        if (docArray.length === 0) {
            chai.request(server).
            get(requestUrl).
            set('Authorization', token).
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
            // continue to save
            saveAllAndTest(done, requestUrl, pageLength);
        }
    });
};
// tests
describe('/GET/ parents one delimiter', function () {
    this.timeout(120000);
    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                // save user
                user.save(function (err) {
                    if (err) {
                        throw err;
                    }

                    //login to be authenticated
                    chai.request(server).
                        post('/api/signIn').
                        send({
                            'password': '123bla456bla',
                            'username': 'ol'
                        }).
                        end(function (err2, res) {
                            if (err2) {
                                done(err2);
                            } else {
                                res.should.have.status(200);
                                token = res.body.token;
                                done();
                            }
                        });
                });

            });
});
    });
    // --- End of "Mockgoose Initiation" --- //
    it(
        'it should GET page of parents without restrictions',
        function (done) {
            // provide   document that will not be retrieved
            docArray.push(new User({
                address: 'rehab',
                birthdate: '01/01/1997',
                email: 'blab@bla.bla',
                firstName: 'bla',
                isEmailVerified: true,
                isParent: false,
                lastName: 'blab',
                password: '123bla456bla',
                username: 'blab'
            }));
            // provide the documents that will be retrieved
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    email: 'bla@bla.bla' + counter,
                    firstName: 'bla',
                    isEmailVerified: true,
                    isParent: true,
                    lastName: 'bla' + counter,
                    password: '123bla456bla',
                    username: 'blabla' + counter
                }));
            }
                saveAllAndTest(
                    done,
                    '/api/User/Search/NA/NA/NA/NA/1/10',
                    3
                );

        }
    );
    it(
        'it should GET page of parents with specified username',
        function (done) {

            // provide   document that will not be retrieved
            docArray.push(new User({
                address: 'cairo',
                birthdate: '01/01/1997',
                email: 'blab@bla.bla',
                firstName: 'bla',
                isEmailVerified: true,
                isParent: true,
                lastName: 'blab',
                password: '123bla456bla',
                username: 'blab'
            }));
          // provide the documents that will be retrieved
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    email: 'bla@bla.bla' + counter,
                    firstName: 'bla',
                    isEmailVerified: true,
                    isParent: true,
                    lastName: 'bla' + counter,
                    password: '123bla456bla',
                    username: 'blablaa' + counter
                }));
            }
                saveAllAndTest(
                    done,
                    '/api/User/Search/blablaa0/NA/NA/NA/1/10',
                    1
                );
        }
    );
    it(
        'it should GET page of parents with specified address',
        function (done) {
            // provide   document that will not be retrieved
            docArray.push(new User({
                address: 'rehab',
                birthdate: '01/01/1997',
                email: 'blab@bla.bla',
                firstName: 'bla',
                isEmailVerified: true,
                isParent: true,
                lastName: 'blab',
                password: '123bla456bla',
                username: 'blab'
            }));
            // provide the documents that will be retrieved
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    email: 'bla@bla.bla' + counter,
                    firstName: 'bla',
                    isEmailVerified: true,
                    isParent: true,
                    lastName: 'bla' + counter,
                    password: '123bla456bla',
                    username: 'blabb' + counter
                }));
            }
                saveAllAndTest(
                    done,
                    '/api/User/Search/NA/NA/NA/cairo/1/10',
                    10
                );
        }
    );
    it(
        'it should GET page of parents with specified education level',
        function (done) {
            // provide   document that will not be retrieved
            docArray.push(new User({
                address: 'rehab',
                birthdate: '01/01/1997',
                email: 'blab@bla.bla',
                firstName: 'bla',
                isEmailVerified: true,
                isParent: true,
                lastName: 'blab',
                password: '123bla456bla',
                username: 'blab'
            }));
            // provide the documents that will be retrieved
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    educationLevel: 'first',
                    email: 'lo@lo.lo' + counter,
                    firstName: 'lo',
                    isChild: true,
                    isEmailVerified: true,
                    lastName: 'lo' + counter,
                    password: '123bla456bla',
                    username: 'lolo' + counter
                }));
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    children: ['lolo' + counter],
                    email: 'bla@bla.bla' + counter,
                    firstName: 'bla',
                    isEmailVerified: true,
                    isParent: true,
                    lastName: 'bla' + counter,
                    password: '123bla456bla',
                    username: 'blabla' + counter
                }));

            }
                saveAllAndTest(
                    done,
                    '/api/User/Search/NA/first/NA/NA/1/10',
                    5
                );
        }
    );
    it(
        'it should GET page of parents with specified education System',
        function (done) {
            // provide   document that will not be retrieved
            docArray.push(new User({
                address: 'rehab',
                birthdate: '01/01/1997',
                email: 'blab@bla.bla',
                firstName: 'bla',
                isEmailVerified: true,
                isParent: true,
                lastName: 'blab',
                password: '123bla456bla',
                username: 'blab'
            }));
            // provide the documents that will be retrieved
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    educationSystem: 'IG',
                    email: 'lo@lo.lo' + counter,
                    firstName: 'lo',
                    isChild: true,
                    isEmailVerified: true,
                    lastName: 'lo' + counter,
                    password: '123bla456bla',
                    username: 'lolob' + counter
                }));
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    children: ['lolo' + counter],
                    email: 'bla@bla.bla' + counter,
                    firstName: 'bla',
                    isEmailVerified: true,
                    isParent: true,
                    lastName: 'bla' + counter,
                    password: '123bla456bla',
                    username: 'blabla' + counter
                }));
            }
                saveAllAndTest(
                    done,
                    '/api/User/Search/NA/NA/IG/NA/1/10',
                    5
                );
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
describe('/GET/ parents two or more delimiters', function () {
    this.timeout(120000);
    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                // save user
                user.save(function (err) {
                    if (err) {
                        throw err;
                    }

                    //login to be authenticated
                    chai.request(server).
                        post('/api/signIn').
                        send({
                            'password': '123bla456bla',
                            'username': 'ol'
                        }).
                        end(function (err2, res) {
                            if (err2) {
                                done(err2);
                            } else {
                                res.should.have.status(200);
                                token = res.body.token;
                                done();
                            }
                        });
                });

            });
});
    });
    // --- End of "Mockgoose Initiation" --- //
    // --- Clearing Mockgoose --- //
    // --- End of "Clearing Mockgoose" --- //
    it(
        'it should GET page of parents with specified username and location',
        function (done) {
            // provide   document that will be retrieved
            docArray.push(new User({
                address: 'rehab',
                birthdate: '01/01/1997',
                email: 'blab@bla.bla',
                firstName: 'bla',
                isEmailVerified: true,
                isParent: true,
                lastName: 'blab',
                password: '123bla456bla',
                username: 'bclab'
            }));
            // provide the documents that will not be retrieved
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    email: 'bla@bla.bla' + counter,
                    firstName: 'bla',
                    isEmailVerified: true,
                    isParent: true,
                    lastName: 'bla' + counter,
                    password: '123bla456bla',
                    username: 'bclabla' + counter
                }));
            }
                saveAllAndTest(
                    done,
                    '/api/User/Search/blab/NA/NA/rehab/1/10',
                    3
                );
        }
    );
    it(
        'it should GET page of parents with specified edu level and location',
        function (done) {
            // provide   document that will not be retrieved
            docArray.push(new User({
                address: 'rehab',
                birthdate: '01/01/1997',
                email: 'blab@bla.bla',
                firstName: 'bla',
                isEmailVerified: true,
                isParent: true,
                lastName: 'blab',
                password: '123bla456bla',
                username: 'blaOb'
            }));
            // provide the documents that will be retrieved
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    educationLevel: 'first',
                    email: 'lo@lo.lo' + counter,
                    firstName: 'lo',
                    isChild: true,
                    isEmailVerified: true,
                    lastName: 'lo' + counter,
                    password: '123bla456bla',
                    username: 'loloO' + counter
                }));
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    children: ['lolo' + counter],
                    email: 'bla@bla.bla' + counter,
                    firstName: 'bla',
                    isEmailVerified: true,
                    isParent: true,
                    lastName: 'bla' + counter,
                    password: '123bla456bla',
                    username: 'blablOa' + counter
                }));
            }
                saveAllAndTest(
                    done,
                    '/api/User/Search/NA/first/NA/cairo/1/10',
                    5
                );
        }
    );
    it(
        'it should GET page of parents with specified edu System and location',
        function (done) {
            // provide   document that will not be retrieved
            docArray.push(new User({
                address: 'rehab',
                birthdate: '01/01/1997',
                email: 'blab@bla.bla',
                firstName: 'bla',
                isEmailVerified: true,
                isParent: true,
                lastName: 'blab',
                password: '123bla456bla',
                username: 'blaab'
            }));
            // provide the documents that will be retrieved
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    educationSystem: 'IG',
                    email: 'lo@lo.lo' + counter,
                    firstName: 'lo',
                    isChild: true,
                    isEmailVerified: true,
                    lastName: 'lo' + counter,
                    password: '123bla456bla',
                    username: 'laaolo' + counter
                }));
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    children: ['lolo' + counter],
                    email: 'bla@bla.bla' + counter,
                    firstName: 'bla',
                    isEmailVerified: true,
                    isParent: true,
                    lastName: 'bla' + counter,
                    password: '123bla456bla',
                    username: 'blaabla' + counter
                }));
            }
                saveAllAndTest(
                    done,
                    '/api/User/Search/NA/NA/IG/cairo/1/10',
                    5
                );
        }
    );
    it(
        'it should GET page of parents with specified edu System and level',
        function (done) {
            // provide   document that will not be retrieved
            docArray.push(new User({
                address: 'rehab',
                birthdate: '01/01/1997',
                email: 'blab@bla.bla',
                firstName: 'bla',
                isEmailVerified: true,
                isParent: true,
                lastName: 'blab',
                password: '123bla456bla',
                username: 'balab'
            }));
            // provide the documents that will be retrieved
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    educationLevel: 'first',
                    educationSystem: 'IG',
                    email: 'lo@lo.lo' + counter,
                    firstName: 'lo',
                    isChild: true,
                    isEmailVerified: true,
                    lastName: 'lo' + counter,
                    password: '123bla456bla',
                    username: 'lolao' + counter
                }));
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    children: ['lolo' + counter],
                    email: 'bla@bla.bla' + counter,
                    firstName: 'bla',
                    isEmailVerified: true,
                    isParent: true,
                    lastName: 'bla' + counter,
                    password: '123bla456bla',
                    username: 'blablaaaa' + counter
                }));
            }
                saveAllAndTest(
                    done,
                    '/api/User/Search/NA/first/IG/NA/1/10',
                    5
                );
        }
    );
    it(
        'it should GET page of parents with tags:location , edu System ,level',
        function (done) {
            // provide   document that will not be retrieved
            docArray.push(new User({
                address: 'rehab',
                birthdate: '01/01/1997',
                email: 'blab@bla.bla',
                firstName: 'bla',
                isEmailVerified: true,
                isParent: true,
                lastName: 'blab',
                password: '123bla456bla',
                username: 'blabaaa'
            }));
            // provide the documents that will be retrieved
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    educationLevel: 'first',
                    educationSystem: 'IG',
                    email: 'lo@lo.lo' + counter,
                    firstName: 'lo',
                    isChild: true,
                    isEmailVerified: true,
                    lastName: 'lo' + counter,
                    password: '123bla456bla',
                    username: 'loloa' + counter
                }));
                docArray.push(new User({
                    address: 'cairo',
                    birthdate: '01/01/1997',
                    children: ['lolo' + counter],
                    email: 'bla@bla.bla' + counter,
                    firstName: 'bla',
                    isEmailVerified: true,
                    isParent: true,
                    lastName: 'bla' + counter,
                    password: '123bla456bla',
                    username: 'blablaaa' + counter
                }));
            }
                saveAllAndTest(
                    done,
                    '/api/User/Search/NA/first/IG/cairo/1/10',
                    5
                );
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
