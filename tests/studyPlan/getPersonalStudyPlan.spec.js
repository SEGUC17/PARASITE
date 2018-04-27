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

var johnDoe = null;
var janeDoe = null;
var johnny = null;
var studyPlan = null;
var conductTests = function (res) {
    res.should.be.json;
    res.should.have.status(200);
    res.body.data.should.be.a('object');
    res.body.data.should.have.property(
        '_id',
        '9ac09be2f578185d46efc3c7',
        'Wrong Study Plan Retrieved _id: ' +
        res.body.data._id.toString()
    );
    res.body.data.should.have.property(
        'creator',
        studyPlan.creator,
        'Wrong Study Plan Retrieved creator: ' +
        res.body.data.creator
    );
    res.body.data.should.have.property(
        'title',
        studyPlan.title,
        'Wrong Study Plan Retrieved title: ' +
        res.body.data.title
    );
    res.body.data.should.have.property(
        'description',
        studyPlan.description,
        'Wrong Study Plan Retrieved description: ' +
        res.body.data.description
    );
    expect(res.body.data.events).to.have.deep.
        members([
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
        ]);
};

describe('Retrieve Personal Study Plan GET', function () {
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
        'should return the study plan with status 200 on valid parameters',
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
                        get('/api/study-plan/getPersonalStudyPlan' +
                            '/' + johnDoe.username + '/' + studyPlan._id).
                        set('Authorization', signinData.body.token).
                        end(function (err2, res) {
                            if (err2) {
                                return console.log(err2);
                            }
                            conductTests(res);
                            done();
                        });
                });
        }
    );

    it(
        'should return the study plan with status 200 on valid parameters for child',
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
                        get('/api/study-plan/getPersonalStudyPlan' +
                            '/' + johnny.username + '/' + studyPlan._id).
                        set('Authorization', signinData.body.token).
                        end(function (err2, res) {
                            if (err2) {
                                return console.log(err2);
                            }
                            conductTests(res);
                            done();
                        });
                });
        }
    );

    it('should return status 404 on invalid parameters', function (done) {
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
                    get('/api/study-plan/getPersonalStudyPlan' +
                        '/' + johnDoe.username + '/fakeid').
                    set('Authorization', signinData.body.token).
                    end(function (err2, res) {
                        if (err2) {
                            return console.log(err2);
                        }

                        res.should.be.json;
                        res.should.have.status(404);
                        done();
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
