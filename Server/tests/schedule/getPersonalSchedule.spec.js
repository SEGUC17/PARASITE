var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var User = mongoose.model('User');
var event = mongoose.model('CalendarEvent');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

describe('/GET/ personal Schedule', function () {
    this.timeout(1200000);

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

    it('it should GET personal schedule from the server', function (done) {
        var events = new event({
            _id: '5ac09ae2f538185d46efc8c4',
            actions: [],
            allDay: true,
            color: '#1e90ff',
            cssClass: '',
            draggable: true,
            end: '2018-04-01T20:07:28.780Z',
            meta: '',
            resizable: true,
            start: '2018-03-29T22:00:00.000Z',
            title: 'myevent'
        });
        var user1 = new User({
            address: 'cairo',
            birthdate: new Date('11/1/1997'),
            email: 'john@real.com',
            firstName: 'john',
            lastName: 'ken',
            password: 'hashed password',
            phone: ['01448347987'],
            schedule: [events],
            username: 'john'
        });
        var Tests = function (res) {
            res.should.be.json;
            res.should.have.status(200);
            res.body.data.should.be.a('array');
            expect(res.body.data).to.have.deep.
                members([
                    {
                        _id: '5ac09ae2f538185d46efc8c4',
                        actions: [],
                        allDay: true,
                        color: '#1e90ff',
                        cssClass: '',
                        draggable: true,
                        end: '2018-04-01T20:07:28.780Z',
                        meta: '',
                        resizable: true,
                        start: '2018-03-29T22:00:00.000Z',
                        title: 'myevent'
                    }
                ]);
        };

        user1.save(function (err) {
            if (err) {
                return console.log(err);
            }
            chai.request(server).get('/api/schedule/getPersonalSchedule/' +
                'john').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    Tests(res);
                    done();
                });
        });
    });

    it('should return status 404 on invalid parameters', function (done) {
        chai.request(server).get('/api/schedule/getPersonalSchedule/' +
            'john').
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
