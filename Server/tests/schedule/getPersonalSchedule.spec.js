/*eslint max-statements: ["error", 20]*/
/*eslint max-len: ["error", 320]*/

var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var User = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var johnDoe = null;
var janeDoe = null;
var johnny = null;
var aCalendarEvent = null;

describe('/GET/ personal Schedule', function () {

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
            // Reinitializing users and calendarEvent as .save may change them
            aCalendarEvent = {
                actions: [],
                color: {
                    'primary': '#ad2121',
                    'secondary': '#FAE3E3'
                },
                draggable: true,
                end: Date(2020, 10, 6),
                resizable: {
                    afterEnd: true,
                    beforeStart: true
                },
                start: Date(2020, 8, 6),
                title: 'test event'
            };
            johnDoe = new User({
                address: 'John Address Sample',
                birthdate: '1/1/1980',
                children: ['johnny'],
                email: 'johndoe@gmail.com',
                firstName: 'John',
                isEmailVerified: true,
                isTeacher: true,
                lastName: 'Doe',
                password: 'JohnPasSWorD',
                phone: ['123'],
                schedule: [aCalendarEvent],
                username: 'john'
            });
            janeDoe = new User({
                address: 'Jane Address Sample',
                birthdate: '1/1/2000',
                email: 'janedoe@gmail.com',
                firstName: 'Jane',
                isEmailVerified: true,
                isTeacher: true,
                lastName: 'Doe',
                password: 'JanePasSWorD',
                phone: ['123'],
                username: 'jane'
            });
            johnny = new User({
                address: 'Johnny Address Sample',
                birthdate: '1/1/1980',
                email: 'johnny@gmail.com',
                firstName: 'Johnny',
                isChild: true,
                isEmailVerified: true,
                isTeacher: true,
                lastName: 'Doe',
                password: 'JohnPasSWorD',
                phone: ['123'],
                username: 'johnny'
            });
            done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    it('it should GET user\'s own personal schedule', function (done) {
        // Creating the User
        johnDoe.save(function (err0) {
            if (err0) {
                console.log(err0);
            }
            // Logging in
            chai.request(server).
                post('/api/signIn').
                send({
                    'password': 'JohnPasSWorD',
                    'username': johnDoe.username
                }).
                end(function (err1, signinData) {
                    if (err1) {
                        console.log(err1);
                    }
                    // Retrieving Schedule
                    chai.request(server).
                        get('/api/schedule/getPersonalSchedule/' + johnDoe.username).
                        set('Authorization', signinData.body.token).
                        end(function (err2, retrieveData) {
                            if (err2) {
                                console.log(err2);
                            }
                            retrieveData.should.have.status(200);
                            should.not.exist(retrieveData.body.err);
                            retrieveData.body.data.should.be.a('array');
                            retrieveData.body.data[0].should.be.a('object');
                            retrieveData.body.data[0].should.have.property('title');
                            retrieveData.body.data[0].should.have.property('start');
                            retrieveData.body.data[0].should.have.property('end');
                            retrieveData.body.data[0].title.should.
                                equal(aCalendarEvent.title);
                            Date(retrieveData.body.data[0].start).should.
                                equal(Date(Date(aCalendarEvent.start)));
                            Date(retrieveData.body.data[0].end).should.
                                equal(Date(Date(aCalendarEvent.end)));
                            done();
                        });
                });
        });
    });

    it('it should GET user\'s child\'s personal schedule', function (done) {
        // Creating the User
        johnDoe.save(function (err0) {
            if (err0) {
                console.log(err0);
            }
            johnny.save(function (err1) {
                // Logging in
                chai.request(server).
                    post('/api/signIn').
                    send({
                        'password': 'JohnPasSWorD',
                        'username': johnDoe.username
                    }).
                    end(function (err2, signinData) {
                        if (err2) {
                            console.log(err2);
                        }
                        // Retrieving Schedule
                        chai.request(server).
                            get('/api/schedule/getPersonalSchedule/' + johnDoe.username).
                            set('Authorization', signinData.body.token).
                            end(function (err3, retrieveData) {
                                if (err3) {
                                    console.log(err3);
                                }
                                retrieveData.should.have.status(200);
                                should.not.exist(retrieveData.body.err);
                                retrieveData.body.data.should.be.a('array');
                                retrieveData.body.data[0].should.be.a('object');
                                retrieveData.body.data[0].should.have.property('title');
                                retrieveData.body.data[0].should.have.property('start');
                                retrieveData.body.data[0].should.have.property('end');
                                retrieveData.body.data[0].title.should.
                                    equal(aCalendarEvent.title);
                                Date(retrieveData.body.data[0].start).should.
                                    equal(Date(Date(aCalendarEvent.start)));
                                Date(retrieveData.body.data[0].end).should.
                                    equal(Date(Date(aCalendarEvent.end)));
                                done();
                            });
                    });
            });
        });
    });

    it('should NOT GET a user\'s personal schedule who isn\'t the user or their child ', function (done) {

        // Creating the Users
        janeDoe.save(function (err0) {
            if (err0) {
                console.log(err0);
            }
            johnDoe.save(function (err1) {
                if (err1) {
                    console.log(err1);
                }
                // Logging in
                chai.request(server).
                    post('/api/signIn').
                    send({
                        'password': 'JohnPasSWorD',
                        'username': johnDoe.username
                    }).
                    end(function (err2, signinData) {
                        if (err2) {
                            console.log(err2);
                        }
                        // Retrieving Schedule
                        chai.request(server).
                            get('/api/schedule/getPersonalSchedule/' + janeDoe.username).
                            set('Authorization', signinData.body.token).
                            end(function (err3, retrieveData) {
                                if (err3) {
                                    console.log(err3);
                                }
                                retrieveData.should.have.status(401);
                                retrieveData.body.err.should.equal('Not authorized to view user\'s Schedule');
                                should.not.exist(retrieveData.body.data);
                                done();
                            });
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
});


