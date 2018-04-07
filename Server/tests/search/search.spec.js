var server = require('../../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var User = require('../../api/models/User');
var expect = chai.expect;
var should = chai.should();
var mockgoose = new Mockgoose(mongoose);
chai.use(chaiHttp);
var config = require('../../api/config/config');
//testing the get requests
describe('search', function () {
    this.timeout(120000);
    var user1 = new User({
        address: 'cairo',
        birthdate: '01/01/1997',
        email: 'bla@bla.bla',
        firstName: 'bla',
        isParent: true,
        lastName: 'bla',
        password: '123bla456bla',
        username: 'blabla'
    });

    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });

    it('it should GET all the parents with no restriction', function (done) {
        user1.save(function (err, saved) {
            if (err) {
                return console.log(err);
            }
            chai.request(server).get('/api/User/Search/NA/NA/NA/NA/1/10').
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                expect(res).to.have.status(200);
                res.body.data.should.be.a('array');
                done();
            });
        });
    });
    it('it should GET parents with the specified username', function (done) {
        user1.save(function (err, saved) {
            if (err) {
                return console.log(err);
            }
            chai.request(server).get('/api/User/Search/blabla/NA/NA/NA/1/10').
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                expect(res).to.have.status(200);
                res.body.data.should.be.a('array');
                res.body.data[0].should.have.property('username', 'blabla');
                done();
            });
        });
    });
    it(
        'it should GET parents having children in specified education level',
        function (done) {
            user1.save(function (err, saved) {
                if (err) {
                    return console.log(err);
                }
                chai.request(server).
                get('/api/User/Search/NA/first/NA/NA/1/10').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.data[0].should.have.property('firstName');
                    res.body.data[0].should.have.property('lastName');
                    res.body.data[0].should.have.property('birthdate');
                    res.body.data[0].should.have.property('children');
                    done();
                });
            });
        }
    );
    it(
        'it should GET parents having children in specified education system',
        function (done) {
            user1.save(function (err, saved) {
                if (err) {
                    return console.log(err);
                }
                chai.request(server).get('/api/User/Search/NA/NA/IG/NA/1/10').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.data[0].should.have.property('firstName');
                    res.body.data[0].should.have.property('lastName');
                    res.body.data[0].should.have.property('birthdate');
                    res.body.data[0].should.have.property('children');
                    done();
                });
            });
        }
    );
    afterEach(function (done) {
        User.remove({}, function () {
            done();
        });
    });
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });

});
