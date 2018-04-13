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

describe('Create Study Plan PATCH', function () {
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

    it('should return status 404 if the user isn\'t found', function (done) {
        chai.request(server).
                patch('/api/study-plan/createStudyPlan' +
                    '/jake', {}).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }

                    res.should.be.json;
                    res.should.have.status(404);
                    done();
                });
    });

    it('should return status 200 on successful creation', function (done) {
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

        user.save(function (err) {
            if (err) {
                return console.log(err);
            }

            chai.request(server).
                patch('/api/study-plan/createStudyPlan' +
                    '/jathri', studyPlan).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }

                    res.should.be.json;
                    res.should.have.status(201);
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
