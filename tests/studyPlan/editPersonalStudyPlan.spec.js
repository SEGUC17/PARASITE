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
var johnDoe = null;
var janeDoe = null;
var johnny = null;
var studyPlan = null;

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

describe('Edit Personal Study Plan PATCH', function () {
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
            studyPlan = new StudyPlan({
                _id: '9ac09be2f578185d46efc3c7',
                creator: 'Jathri',
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
                studyPlans: [studyPlan],
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
                studyPlans: [studyPlan],
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
                studyPlans: [studyPlan],
                username: 'johnny'
            });
            johnDoe.save(function (err1) {
                if (err1) {
                    console.log(err1);
                }
                janeDoe.save(function (err2) {
                    if (err2) {
                        console.log(err2);
                    }
                    johnny.save(function (err3) {
                        if (err3) {
                            console.log(err3);
                        }
                        done();
                    });
                });
            });
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    it(
        'should modify the owner\'s study plan with status 200',
        function (done) {

            chai.request(server).
                post('/api/signIn').
                send({
                    'password': 'JohnPasSWorD',
                    'username': johnDoe.username
                }).
                end(function (err1, signinData) {
                    if (err1) {
                        return console.log(err1);
                    }

                    chai.request(server).
                        patch('/api/study-plan/editPersonalStudyPlan/' +
                            johnDoe.username + '/' + studyPlan._id).
                        send(modifications).
                        set('Authorization', signinData.body.token).
                        end(function (err2, res) {
                            if (err2) {
                                console.log(err2);
                            }

                            res.should.be.json;
                            res.should.have.status(200);
                            User.findOne(
                                {
                                    'studyPlans._id': studyPlan._id,
                                    username: johnDoe.username
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

                });
        }
    );

    it(
        'should modify the child\'s study plan with status 200',
        function (done) {

            chai.request(server).
                post('/api/signIn').
                send({
                    'password': 'JohnPasSWorD',
                    'username': johnDoe.username
                }).
                end(function (err1, signinData) {
                    if (err1) {
                        return console.log(err1);
                    }

                    chai.request(server).
                        patch('/api/study-plan/' +
                            'editPersonalStudyPlan/' +
                            johnny.username + '/' +
                            studyPlan._id).
                        send(modifications).
                        set(
                            'Authorization',
                            signinData.body.token
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
                                    username: johnny.username
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
                });
        }
    );

    it(
        'should return status 401 if the study plan doesn\'t belong' +
        'to the user or one of their children',
        function (done) {

            chai.request(server).
                post('/api/signIn').
                send({
                    'password': 'JohnPasSWorD',
                    'username': johnDoe.username
                }).
                end(function (err1, signinData) {
                    if (err1) {
                        return console.log(err1);
                    }

                    chai.request(server).
                        patch('/api/study-plan/editPersonalStudyPlan/' +
                         janeDoe.username + '/' + studyPlan._id).
                        send({}).
                        set('Authorization', signinData.body.token).
                        end(function (err2, res) {
                            if (err2) {
                                console.log(err2);
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
