var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
// var request = require('supertest');
var assert = chai.assert;

chai.use(chaiHttp);

describe('send request to add psychologist information', function () {
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
            });
    });
});
