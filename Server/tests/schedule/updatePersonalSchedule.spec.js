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
        var newUser = new User({
            birthdate: '12/12/1200',
            children: [],
            email: 'test@test.com',
            firstName: 'i',
            isChild: false,
            lastName: 'test',
            password: 'realPassword',
            phone: [],
            schedule: [],
            username: 'testUser'
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
        newUser.save(function(error, data) {
            if (error) {
                return console.log(error);
            }
            chai.request(server).
            patch('/api/schedule/saveScheduleChanges/' + data.username).
            set('user', JSON.stringify(data)).
            send({ 'body': [aCalendarEvent] }).
             end(function(err, res) {
                 if (err) {
                     return console.log(err);
                 }
                 // FIXME: User is not signed in!
                 console.log(res.body);
                 res.should.have.status(200);
                 res.body.data.should.be.a('array');
                 res.body.data[0].should.be.a('object');
                 res.body.data[0].should.have.property('title');
                 res.body.data[0].title.should.equal('test event');
                 done();
             });
        });
    });
    it('should PATCH user\'s child\'s personal schedule');
    it('should NOT PATCH child\'s own personal schedule');
    it('should NOT PATCH another user\'s personal' +
     'schedule who isn\'t the user\'s child');
});
