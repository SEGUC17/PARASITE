/*eslint max-statements: ["error", 20]*/
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var User = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
chai.use(chaiHttp);


// --- Variables Needed In Testing --- //
var johnDoe = new User({
    address: 'John Address Sample',
    birthdate: '1/1/1980',
    email: 'johndoe@gmail.com',
    firstName: 'John',
    isTeacher: true,
    lastName: 'Doe',
    password: 'JohnPasSWorD',
    phone: ['123'],
    username: 'john'
});
var janeDoe = new User({
    address: 'Jane Address Sample',
    birthdate: '1/1/2000',
    email: 'janedoe@gmail.com',
    firstName: 'Jane',
    isTeacher: true,
    lastName: 'Doe',
    password: 'JanePasSWorD',
    phone: ['123'],
    username: 'jane'
});
var johnny = new User({
    address: 'Johnny Address Sample',
    birthdate: '1/1/1980',
    email: 'johnny@gmail.com',
    firstName: 'Johnny',
    isTeacher: true,
    lastName: 'Doe',
    password: 'JohnPasSWorD',
    phone: ['123'],
    username: 'johnny'
});
var aCalendarEvent = {
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
var anActivity = {
    creator: 'normalusername',
    description: 'activity1 des',
    fromDateTime: Date.now(),
    name: 'activity1',
    price: 50,
    status: 'pending',
    toDateTime: Date.now() + 5
};
// --- End of "Variables Needed In Testing" --- //


describe('updateSchedule', function () {
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

    it('it should PATCH user\'s own personal schedule', function (done) {
        // Creating the User
        chai.request(server).
            post('/api/signUp').
            send(johnDoe).
            end(function (err1, signupData) {
                if (err1) {
                    console.log(err1);
                }
                // Updating Schedule
                chai.request(server).
                    patch('/api/schedule/saveScheduleChanges/' +
                        johnDoe.username).
                    set('Authorization', signupData.body.token).
                    send([aCalendarEvent]).
                    end(function (err2, updateData) {
                        if (err2) {
                            console.log(err2);
                        }
                        updateData.should.have.status(200);
                        should.not.exist(updateData.body.err);
                        User.findOne({ 'username': johnDoe.username }, function(err0, userData) {
                            userData.schedule.should.be.a('array');
                            userData.schedule[0].should.be.a('object');
                            userData.schedule[0].should.have.property('title');
                            userData.schedule[0].should.have.property('start');
                            userData.schedule[0].should.have.property('end');
                            userData.schedule[0].title.should.
                                equal(aCalendarEvent.title);
                            Date(userData.schedule[0].start).should.
                                equal(Date(Date(aCalendarEvent.start)));
                            Date(userData.schedule[0].end).should.
                                equal(Date(Date(aCalendarEvent.end)));
                            done();
                        });
                    });
            });
    });
    it('it should PATCH user\'s child\'s personal schedule', function (done) {
        // Creating the user
        chai.request(server).
            post('/api/signUp').
            send(johnDoe).
            end(function (err1, signupData) {
                if (err1) {
                    console.log(err1);
                }
                // Creating the child
                chai.request(server).
                    post('/api/childsignup').
                    set('Authorization', signupData.body.token).
                    send(johnny).
                    end(function (err2, childSignupData) {
                        if (err2) {
                            console.log(err2);
                        }
                        childSignupData.should.have.status(201);
                        // Updating Schedule
                        chai.request(server).
                            patch('/api/schedule/saveScheduleChanges/' +
                                johnny.username).
                            set('Authorization', signupData.body.token).
                            send([aCalendarEvent]).
                            end(function (err3, updateData) {
                                if (err3) {
                                    console.log(err3);
                                }
                                updateData.should.have.status(200);
                                should.not.exist(updateData.body.err);
                                User.findOne({ 'username': johnny.username }, function(err0, userData) {
                                userData.schedule.should.be.a('array');
                                userData.schedule[0].should.be.a('object');
                                userData.schedule[0].should.
                                    have.property('title');
                                userData.schedule[0].should.have.
                                    property('start');
                                userData.schedule[0].should.have.
                                    property('end');
                                userData.schedule[0].title.should.
                                    equal(aCalendarEvent.title);
                                Date(userData.schedule[0].start).should.
                                    equal(Date(aCalendarEvent.start));
                                Date(userData.schedule[0].end).should.
                                    equal(Date(aCalendarEvent.end));
                                });
                                done();
                            });
                    });
            });
    });
    it('it should NOT PATCH child\'s own personal schedule', function (done) {
        // Creating parent
        chai.request(server).
            post('/api/signUp').
            send(johnDoe).
            end(function (err1, signupData) {
                if (err1) {
                    console.log(err1);
                }
                // Creating Child
                chai.request(server).
                    post('/api/childsignup').
                    set('Authorization', signupData.body.token).
                    send(johnny).
                    end(function (err2, childSignupData) {
                        // Logging in as child
                        chai.request(server).
                            post('/api/signIn').
                            send({
                                'password': johnny.password,
                                'username': johnny.username
                            }).
                            end(function (err3, siginData) {
                                if (err3) {
                                    console.log(err3);
                                }
                                // Updating schedule
                                chai.request(server).
                                    patch('/api/schedule/saveScheduleChanges/' +
                                        johnny.username).
                                    set('Authorization', siginData.body.token).
                                    send([aCalendarEvent]).
                                    end(function (err4, updateData) {
                                        if (err4) {
                                            console.log(err4);
                                        }
                                        updateData.should.have.status(401);
                                        updateData.body.err.should.
                                            be.a('string');
                                        updateData.body.err.should.
                                            equal('Not authorized to' +
                                                ' edit user\'s Schedule');
                                        should.not.exist(updateData.body.msg);
                                        done();
                                    });
                            });
                    });
            });
    });
    it('it should NOT PATCH another user\'s personal' +
        'schedule who isn\'t the user\'s child', function (done) {
            // Creating user whose schedule is to be changed
            chai.request(server).
                post('/api/signUp').
                send(janeDoe).
                end(function (err1, signup1Data) {
                    if (err1) {
                        console.log(err1);
                    }
                    // Creating user who'll try to change schedule
                    chai.request(server).
                        post('/api/signUp').
                        send(johnDoe).
                        end(function (err2, signup2Data) {
                            if (err2) {
                                console.log(err2);
                            }
                            // Updating schedule
                            chai.request(server).
                                patch('/api/schedule/saveScheduleChanges/' +
                                    janeDoe.username).
                                set('Authorization', signup2Data.body.token).
                                send([aCalendarEvent]).
                                end(function (err3, updateData) {
                                    if (err3) {
                                        console.log(err3);
                                    }
                                    updateData.should.have.status(401);
                                    updateData.body.err.should.be.a('string');
                                    updateData.body.err.should.
                                        equal('Not authorized to' +
                                            ' edit user\'s Schedule');
                                    should.not.exist(updateData.body.msg);
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
});

describe('addEvent', function () {
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

    it('it should PUT activity in user\'s' +
    ' own personal schedule', function (done) {
        // Creating the User
        chai.request(server).
            post('/api/signUp').
            send(johnDoe).
            end(function (err1, signupData) {
                if (err1) {
                    console.log(err1);
                }
                // Updating Schedule
                chai.request(server).
                    put('/api/schedule/addEvent/' +
                         johnDoe.username).
                    set('Authorization', signupData.body.token).
                    send(aCalendarEvent).
                    end(function (err2, updateData) {
                        if (err2) {
                            console.log(err2);
                        }
                        updateData.should.have.status(200);
                        should.not.exist(updateData.body.err);
                        User.findOne({ 'username': johnDoe.username }, function(err0, userData) {
                        userData.schedule.should.be.a('array');
                        userData.schedule[0].should.be.a('object');
                        userData.schedule[0].should.have.property('title');
                        userData.schedule[0].should.have.property('start');
                        userData.schedule[0].should.have.property('end');
                        userData.schedule[0].title.should.
                            equal(aCalendarEvent.title);
                        Date(userData.schedule[0].start).should.
                            equal(Date(aCalendarEvent.start));
                        Date(userData.schedule[0].end).should.
                            equal(Date(aCalendarEvent.end));
                        done();
                        });
                    });
            });
    });
    it('it should PUT activity in user\'s' +
    ' child\'s personal schedule', function (done) {
        // Creating the user
        chai.request(server).
            post('/api/signUp').
            send(johnDoe).
            end(function (err1, signupData) {
                if (err1) {
                    console.log(err1);
                }
                // Creating the child
                chai.request(server).
                    post('/api/childsignup').
                    set('Authorization', signupData.body.token).
                    send(johnny).
                    end(function (err2, childSignupData) {
                        if (err2) {
                            console.log(err2);
                        }
                        childSignupData.should.have.status(201);
                        // Updating Schedule
                        chai.request(server).
                            put('/api/schedule/addEvent/' +
                                 johnny.username).
                            set('Authorization', signupData.body.token).
                            send(aCalendarEvent).
                            end(function (err3, updateData) {
                                if (err3) {
                                    console.log(err3);
                                }
                                updateData.should.have.status(200);
                                should.not.exist(updateData.body.err);
                                User.findOne({ 'username': johnny.username }, function(err0, userData) {
                                userData.schedule.should.be.a('array');
                                userData.schedule[0].should.be.a('object');
                                userData.schedule[0].should.
                                    have.property('title');
                                userData.schedule[0].should.have.
                                    property('start');
                                userData.schedule[0].should.have.
                                    property('end');
                                userData.schedule[0].title.should.
                                    equal(aCalendarEvent.title);
                                Date(userData.schedule[0].start).should.
                                    equal(Date(aCalendarEvent.start));
                                Date(userData.schedule[0].end).should.
                                    equal(Date(aCalendarEvent.end));
                                done();
                                });
                            });
                    });
            });
    });
    it('it should NOT PUT activity in child\'s' +
    ' own personal schedule', function (done) {
        // Creating parent
        chai.request(server).
            post('/api/signUp').
            send(johnDoe).
            end(function (err1, signupData) {
                if (err1) {
                    console.log(err1);
                }
                // Creating Child
                chai.request(server).
                    post('/api/childsignup').
                    set('Authorization', signupData.body.token).
                    send(johnny).
                    end(function (err2, childSignupData) {
                        // Logging in as child
                        chai.request(server).
                            post('/api/signIn').
                            send({
                                'password': johnny.password,
                                'username': johnny.username
                            }).
                            end(function (err3, signinData) {
                                if (err3) {
                                    console.log(err3);
                                }
                                // Updating schedule
                                chai.request(server).
                                    put('/api/schedule/addEvent/' +
                                         johnny.username).
                                    set('Authorization', signinData.body.token).
                                    send(aCalendarEvent).
                                    end(function (err4, updateData) {
                                        if (err4) {
                                            console.log(err4);
                                        }
                                        updateData.should.have.status(401);
                                        updateData.body.err.should.
                                            be.a('string');
                                        updateData.body.err.should.
                                            equal('Not authorized to' +
                                                ' edit user\'s Schedule');
                                        should.not.exist(updateData.body.msg);
                                        done();
                                    });
                            });
                    });
            });
    });
    it('it should NOT PUT new activity in another user\'s personal' +
        'schedule who isn\'t the user\'s child', function (done) {
            // Creating user whose schedule is to be changed
            chai.request(server).
                post('/api/signUp').
                send(janeDoe).
                end(function (err1, signup1Data) {
                    if (err1) {
                        console.log(err1);
                    }
                    // Creating user who'll try to change schedule
                    chai.request(server).
                        post('/api/signUp').
                        send(johnDoe).
                        end(function (err2, signup2Data) {
                            if (err2) {
                                console.log(err2);
                            }
                            // Updating schedule
                            chai.request(server).
                                put('/api/schedule/addEvent/' +
                                     janeDoe.username).
                                set('Authorization', signup2Data.body.token).
                                send(aCalendarEvent).
                                end(function (err3, updateData) {
                                    if (err3) {
                                        console.log(err3);
                                    }
                                    updateData.should.have.status(401);
                                    updateData.body.err.should.be.a('string');
                                    updateData.body.err.should.
                                        equal('Not authorized to' +
                                            ' edit user\'s Schedule');
                                    should.not.exist(updateData.body.msg);
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
});
