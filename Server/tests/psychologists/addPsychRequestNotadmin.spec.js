/* eslint-disable max-len */
/* eslint-disable max-statements */

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var server = require('../../app');
var users = mongoose.model('User');
var expect = require('chai').expect;

chai.use(chaiHttp);

/* preparing Mockooge */
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

/* End of "Clearing Mockgoose" */
describe('send a request by a reular rgistered/unregistered user', function () {
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function (err) {
                done(err);
            });
        });
    });

    /* Mockgoose is ready */
    /* Clearing Mockgoose */
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
});

/* End of "Clearing Mockgoose" */
describe('send a request to add psychologist by a reular rgistered/unregistered user', function () {
    it('post a request to add psychologist information', function () {
        var req = {
            address: 'here',
            createdAt: '1/1/2018',
            daysOff:
                [
                    'sat',
                    'sun'
                ],
            email: 'blah@blah.com',
            firstName: 'mariam',
            lastName: 'mahran',
            phone: '010101',
            priceRange: 1000
        };
        chai.request(server).post('/api/psychologist/request/add/addRequest').
            send(req).
            end(function (err, res) {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(200);
                res.body.msg.should.be.equal('Request was created successfully.');
            });
    });
});

/* Mockgoose Termination */
after(function (done) {
    mongoose.connection.close(function () {
        done();
    });
});

/* End of "Mockgoose Termination" */
