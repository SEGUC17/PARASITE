var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var StudyPlan = mongoose.model('StudyPlan');
var User = mongoose.model('User');
var expect = require('chai').expect;

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

describe('/GET/ Personal Study Plan', function () {

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

    it('should return status 200 on valid parameters', function (done) {
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
            studyPlans: [studyPlan],
            username: 'jathri'
        });

        user.save(function (err) {
            if (err) {
                return console.log(err);
            }

            chai.request(server).
                get('/api/study-plan/getPersonalStudyPlan' +
                    '/jathri/9ac09be2f578185d46efc3c7').
                end(function (error, res) {
                    // if (error) {
                    //     return console.log(error);
                    // }
                    res.should.be.json;
                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property(
                        '_id',
                        '9ac09be2f578185d46efc3c7',
                        'Wrong Study Plan Retrieved _id ' +
                        res.body.data._id.toString()
                    );
                    res.body.data.should.have.property(
                        'creator',
                        studyPlan.creator,
                        'Wrong Study Plan Retrieved _creator creator ' +
                        res.body.data.creator
                    );
                    res.body.data.should.have.property(
                        'title',
                        studyPlan.title,
                        'Wrong Study Plan Retrieved title ' +
                        res.body.data.title
                    );
                    res.body.data.should.have.property(
                        'description',
                        studyPlan.description,
                        'Wrong Study Plan Retrieved description ' +
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
                    done();
                });
        });
    });


});
