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

describe('Retrieve Personal Study Plan GET', function () {
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
        'should return the study plan with status 200 on valid parameters',
        function (done) {
            var studyPlan = new StudyPlan({
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
                                get('/api/study-plan/getPersonalStudyPlan' +
                                    '/jathri/9ac09be2f578185d46efc3c7').
                                set('Authorization', resSignup.body.token).
                                end(function (errr, res) {
                                    if (errr) {
                                        return console.log(errr);
                                    }
                                    conductTests(res);
                                    done();
                                });
                        }
                    );
                });
        }
    );

    it('should return status 404 on invalid parameters', function (done) {
        var user = new User({
            address: 'A Mental Institute',
            birthdate: new Date('11/1/1997'),
            email: 'Jathri@real.com',
            firstName: 'jathri',
            lastName: 'Ripper',
            password: 'hashed password',
            phone: ['01448347641'],
            studyPlans: [],
            username: 'jathri'
        });

        chai.request(server).
            post('/api/signUp').
            send(user).
            end(function (err, resSignup) {
                if (err) {
                    return console.log(err);
                }

                chai.request(server).
                    get('/api/study-plan/getPersonalStudyPlan' +
                        '/jathri/9ac09be2f578185d46efc3c7').
                    set('Authorization', resSignup.body.token).
                    end(function (error, res) {
                        if (error) {
                            return console.log(error);
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
