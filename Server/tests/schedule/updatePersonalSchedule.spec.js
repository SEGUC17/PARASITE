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
    phone: '123',
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
    phone: '123',
    username: 'jane'
});
var aCalendarEvent = {
    actions: [],
    color: {
        'primary': '#ad2121',
        'secondary': '#FAE3E3'
        },
    draggable: true,
    end: '2018-04-04T21:59:59.999Z',
    resizable: {
        afterEnd: true,
        beforeStart: true
        },
    start: '2018-04-04T18:59:00.000Z',
    title: 'test event'

    };
// --- End of "Variables Needed In Testing" --- //


describe('updateSchedule', function() {
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

    it('should PATCH user\'s own personal schedule', function(done) {
        chai.request(server).
        post('/api/signUp').
        send(johnDoe).
        end(function(error, data) {
            if (error) {
                return console.log(error);
            }
            chai.request(server).
            patch('/api/schedule/saveScheduleChanges/' + johnDoe.username).
            set('Authorization', data.body.token).
            send([aCalendarEvent]).
             end(function(err, res) {
                 if (err) {
                     return console.log(err);
                 }
                 res.should.have.status(200);
                 res.body.data.should.be.a('array');
                 res.body.data[0].should.be.a('object');
                 res.body.data[0].should.have.property('title');
                 res.body.data[0].should.have.property('start');
                 res.body.data[0].should.have.property('end');
                 res.body.data[0].title.should.equal(aCalendarEvent.title);
                 res.body.data[0].start.should.equal(aCalendarEvent.start);
                 res.body.data[0].end.should.equal(aCalendarEvent.end);
                 done();
             });
        });
    });
    it('should PATCH user\'s child\'s personal schedule');
    it('should NOT PATCH child\'s own personal schedule');
    it('should NOT PATCH another user\'s personal' +
     'schedule who isn\'t the user\'s child');
});
