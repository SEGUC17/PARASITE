/*eslint max-statements: ["error", 20]*/
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var User = mongoose.model('User');
var UserRating = mongoose.model('UserRating');
var StudyPlan = mongoose.model('StudyPlan');
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
var aStudyPlan = new StudyPlan({
    _id: '5ad2620c4c5db8584556e291',
    assigned: false,
    creator: 'tester',
    description: '<p>new study plan</p>',
    events: [
        {
            _id: '5ad1ff852e704b23219cf43f',
            actions: [],
            color: {
                end: '2018-04-14T21:59:59.999Z',
                primary: '#ad2121',
                secondary: '#FAE3E3',
                start: '2018-04-13T22:00:00.000Z',
                title: 'New event'

            },
            draggable: true,
            resizable: {
                afterEnd: true,
                beforeStart: true
            }
        }
    ],
    published: true,
    rating: {
        number: 0,
        sum: 0,
        value: 0
    },
    title: 'test study plan'
});
var aRating = {
    ratedId: aStudyPlan._id,
    rating: 5,
    type: 'studyPlan',
    username: 'john'
};
// --- End of "Variables Needed In Testing" --- //


describe('updateSchedule', function () {
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
        'it should create and update a user\'s rating for a study plan',
     function (done) {
        // Creating the user
        chai.request(server).
            post('/api/signUp').
            send(johnDoe).
            end(function (err1, signupData) {
                aStudyPlan.save(function(err2, savedStudyPlan) {
                    should.not.exist(err2);
                    chai.request(server).
                    post('/api/rating/postRating').
                    set('Authorization', signupData.body.token).
                    send({ 'userRating': aRating }).
                    end(function (err3, rateData) {
                        rateData.should.have.status(201);
                        should.not.exist(rateData.body.err);
                        should.not.exist(rateData.body.data);
                        rateData.body.msg.should.equal('Study plan rated succesfully.');
                        UserRating.findOne({ username: johnDoe.username }, function(err4, ratingInDb) {
                            if (err4) {
                                console.log(err4);
                            }
                            should.not.exist(err4);
                            String(ratingInDb.ratedId).should.equal(String(aRating.ratedId));
                            ratingInDb.username.should.equal(aRating.username);
                            ratingInDb.type.should.equal(aRating.type);
                            ratingInDb.rating.should.equal(aRating.rating);
                            done();
                        });

                    });
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

