var mongoose = require('mongoose');
var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../../app');
var StudyPlan = mongoose.model('StudyPlan');
var User = mongoose.model('User');
var expect = require('chai').expect;

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

// testing data
var studyPlan = new StudyPlan({
    _id: '9ac09be2f578185d46efc3c7',
    creator: 'jathri',
    description: '<p class="ql-align-center">' +
        '<span class="ql-size-large">' +
        'Are you ready to go on an adventure?</span></p>',
    events: [
        {
            _id: '5ac09ae2f538185d46efc8c4',
            actions: [],
            color: {
                primary: '#1e90ff',
                secondary: '#D1E8FF'
            },
            end: '2018-04-01T20:07:28.780Z',
            start: '2018-03-29T22:00:00.000Z',
            title: 'So Many Comebacks, So Little Time...'
        }
    ],
    title: 'The Ultimate Guide to KPop'
});

var user = new User({
    address: 'A Mental Institute',
    birthdate: new Date('11/1/1997'),
    email: 'Jathri@real.com',
    firstName: 'jathri',
    lastName: 'Ripper',
    password: 'hashed password',
    phone: ['01448347641'],
    username: 'jathri'
});

var child = new User({
    address: 'A Mental Institute',
    birthdate: new Date('11/1/2005'),
    email: 'child@real.com',
    firstName: 'child',
    lastName: 'Ripper',
    password: 'hashed password',
    phone: ['01448347641'],
    username: 'child'
});

var modifications = {
    description: '<p class="ql-align-center">' +
        '<span class="ql-size-large">' +
        'I ain\'t, go home.</span></p>',
    events: [
        {
            _id: '5ac09ae2f538185d46efc8c4',
            actions: [],
            color: {
                primary: '#1e90ff',
                secondary: '#D1E8FF'
            },
            end: new Date('2018-04-01T20:07:28.780Z'),
            start: new Date('2018-03-29T22:00:00.000Z'),
            title: 'No. Stop.'
        }
    ],
    title: 'The Ultimate Rejection'
};

describe('Edit Personal Study Plan PATCH', function () {
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
        'should modify the owner\'s study plan with status 200',
        function (done) {
            var conductTests = function (updatedUser) {
                updatedUser.studyPlans[0].
                    description.should.
                    eql(modifications.
                        description);
                updatedUser.studyPlans[0].
                    title.should.
                    eql(modifications.title);
                updatedUser.studyPlans[0].
                    events[0]._id.toString().should.
                    eql(modifications.
                        events[0]._id);
                updatedUser.studyPlans[0].
                    events[0].actions.should.
                    eql(modifications.
                        events[0].actions);
                updatedUser.studyPlans[0].
                    events[0].color.should.
                    eql(modifications.
                        events[0].color);
                updatedUser.studyPlans[0].
                    events[0].end.should.
                    eql(modifications.
                        events[0].end);
                updatedUser.studyPlans[0].
                    events[0].start.should.
                    eql(modifications.
                        events[0].start);
                updatedUser.studyPlans[0].
                    events[0].title.should.
                    eql(modifications.
                        events[0].title);
            };

            chai.request(server).
                post('/api/signUp').
                send(user).
                end(function (err, resSignup) {
                    if (err) {
                        return console.log(err);
                    }

                    User.findOneAndUpdate(
                        { username: user.username },
                        { $push: { studyPlans: studyPlan } },
                        function (error) {
                            if (error) {
                                return console.log(error);
                            }

                            chai.request(server).
                                patch('/api/study-plan/editPersonalStudyPlan/' +
                                    user.username + '/' + studyPlan._id).
                                send(modifications).
                                set('Authorization', resSignup.body.token).
                                end(function (err2, res) {
                                    if (err2) {
                                        console.log(err2);
                                    }

                                    res.should.be.json;
                                    res.should.have.status(200);
                                    User.findOne(
                                        {
                                            'studyPlans._id': studyPlan._id,
                                            username: user.username
                                        },
                                        function (err3, updatedUser) {
                                            if (err3) {
                                                console.log(err3);
                                            }

                                            conductTests(updatedUser);
                                            done();
                                        }
                                    );
                                });
                        }
                    );
                });
        }
    );

    it(
        'should modify the child\'s study plan with status 200',
        function (done) {
            var conductTests = function (updatedUser) {
                updatedUser.studyPlans[0].
                    description.should.
                    eql(modifications.
                        description);
                updatedUser.studyPlans[0].
                    title.should.
                    eql(modifications.title);
                updatedUser.studyPlans[0].
                    events[0]._id.toString().should.
                    eql(modifications.
                        events[0]._id);
                updatedUser.studyPlans[0].
                    events[0].actions.should.
                    eql(modifications.
                        events[0].actions);
                updatedUser.studyPlans[0].
                    events[0].color.should.
                    eql(modifications.
                        events[0].color);
                updatedUser.studyPlans[0].
                    events[0].end.should.
                    eql(modifications.
                        events[0].end);
                updatedUser.studyPlans[0].
                    events[0].start.should.
                    eql(modifications.
                        events[0].start);
                updatedUser.studyPlans[0].
                    events[0].title.should.
                    eql(modifications.
                        events[0].title);
            };

            chai.request(server).
                post('/api/signUp').
                send(user).
                end(function (err, resSignup) {
                    if (err) {
                        return console.log(err);
                    }

                    chai.request(server).
                        post('/api/childsignup').
                        set('Authorization', resSignup.body.token).
                        send(child).
                        end(function (error) {
                            if (error) {
                                console.log(error);
                            }

                            User.findOneAndUpdate(
                                { username: child.username },
                                { $push: { studyPlans: studyPlan } },
                                function (err1) {
                                    if (err1) {
                                        return console.log(err1);
                                    }

                                    chai.request(server).
                                        patch('/api/study-plan/' +
                                            'editPersonalStudyPlan/' +
                                            child.username + '/' +
                                            studyPlan._id).
                                        send(modifications).
                                        set(
                                            'Authorization',
                                            resSignup.body.token
                                        ).
                                        end(function (err2, res) {
                                            if (err2) {
                                                console.log(err2);
                                            }

                                            res.should.be.json;
                                            res.should.have.status(200);
                                            User.findOne(
                                                {
                                                    'studyPlans._id': studyPlan.
                                                        _id,
                                                    username: child.username
                                                },
                                                function (err3, updatedUser) {
                                                    if (err3) {
                                                        console.log(err3);
                                                    }

                                                    conductTests(updatedUser);
                                                    done();
                                                }
                                            );
                                        });
                                }
                            );
                        });
                });
        }
    );


    it(
        'should return status 400 if the study plan is not found',
        function (done) {

            chai.request(server).
                post('/api/signUp').
                send(user).
                end(function (err, resSignup) {
                    if (err) {
                        return console.log(err);
                    }

                    chai.request(server).
                        patch('/api/study-plan/editPersonalStudyPlan/' +
                            user.username + '/' + studyPlan._id).
                        send({}).
                        set('Authorization', resSignup.body.token).
                        end(function (error, res) {
                            if (error) {
                                console.log(error);
                            }

                            res.should.be.json;
                            res.should.have.status(404);
                            done();
                        });

                });
        }
    );

    it(
        'should return status 401 if the study plan doesn\'t belong' +
        'to the user or one of their children',
        function (done) {

            chai.request(server).
                post('/api/signUp').
                send(user).
                end(function (err, resSignup) {
                    if (err) {
                        return console.log(err);
                    }

                    chai.request(server).
                        patch('/api/study-plan/editPersonalStudyPlan/' +
                            'notYourChild/' + studyPlan._id).
                        send({}).
                        set('Authorization', resSignup.body.token).
                        end(function (error, res) {
                            if (error) {
                                console.log(error);
                            }

                            res.should.be.json;
                            res.should.have.status(401);
                            done();
                        });

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
