var server = require('../../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var config = require('../../api/config/config');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var User = mongoose.model('User');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

// user
var user = {
    birthdate: '20/6/1997',
    email: 'sarah@gmail.com',
    firstName: 'sarah',
    lastName: 'ayman',
    password: '123456789',
    phone: '87187679',
    username: 'sarah'
};

// token for authentication
var token = null;

describe('/GET inbox', function () {
    // this.enableTimeouts(false);

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

  it('it should GET all received messages of logged in user', function (done) {

            Message.create({
                body: 'hi',
                recipient: 'sarah',
                sender: 'ahmed'
            });

            Message.create({
                body: 'hi',
                recipient: 'asghhdf',
                sender: 'ahmed'
            });

            // sign up and be authenticated
            chai.request(server).
                post('/api/signUp').
                send(user).
                end(function (err, response) {
                    if (err) {
                        return console.log(err);
                    }
                    response.should.have.status(201);
                    token = response.body.token;

                    // var username = user.username;
                    
                    chai.request(server).
                        get('/api/message/inbox/sarah').
                        set('Authorization', token).
                        end(function (error, res) {
                            if (error) {
                                return console.log(error);
                           }
                            res.should.have.status(200);
                            var msgs = res.body.data.docs;
                            for (var msg in msgs) {
                                expect(msg.recipient).to.equal('sarah');
                           }
                           done();
                       });
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

/*var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Content = mongoose.model('Content');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);


chai.use(chaiHttp);

// user for authentication
var user = {
    birthdate: '1/1/1980',
    email: 'omar@omar.omar',
    firstName: 'omar',
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
};
// authenticated token
var token = null;

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
                    for (
                        var counter = 0;
                        counter < res.body.data.docs.length;
                        counter += 1
                    ) {
                        res.body.data.docs[counter].
                            should.have.property('creator', 'omar');
                    }
                    done();
                });
        } else {
            // continue to save
            saveAllAndTest(done, requestUrl, pageLength);
        }
    });
};

// tests
describe('/GET/ Content Page by Creator', function () {
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

    it(
        'it should GET page of content with the specified creator',
        function (done) {

            // provide content document that will not be retrieved
            docArray.push(new Content({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat1',
                creator: 'not omar',
                section: 'sec1',
                title: 'Test Content 3'
            }));

            // provide the documents that will be retrieved
            for (var counter = 0; counter < 3; counter += 1) {
                docArray.push(new Content({
                    approved: true,
                    body: '<h1>Hello</h1>',
                    category: 'cat1',
                    creator: 'omar',
                    section: 'sec1',
                    title: 'Test Content' + counter
                }));
            }
            // sign up and be authenticated
            chai.request(server).
                post('/api/signUp').
                send(user).
                end(function (err, response) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('Signed up!');
                    response.should.have.status(201);
                    token = response.body.token;
                    // perfrom the test
                    saveAllAndTest(
                        done,
                        '/api/content/username/3/1',
                        3
                    );

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


// my user
var user = {
    birthdate: '1/1/1980',
    email: 'omar@omar.omar',
    firstName: 'omar',
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
};
// my token for authentication
var token = null;

it('it should GET page of content with the specified creator',
        function (done) {
			// prepare your test
            // sign up and be authenticated
            chai.request(server).
                post('/api/signUp').
                send(user).
                end(function (err, response) {
                    if (err) {
                        return console.log(err);
                    }
                    response.should.have.status(201);
                    token = response.body.token;
                    // perfrom the test here
				*************************************	
				example:
					chai.request(server).
                       get('/api/content/username/FAIL/1').
                       set('Authorization', token).
                       end(function (error, res) {
                           if (error) {
                               return console.log(error);
                           }
                           expect(res).to.have.status(422);
                           done();
                       });
				*********************************************
                    //before finally calling done()
					done();
                });
        }
    );*/