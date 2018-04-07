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
describe('search', function () {
    this.timeout(1200000);
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    it('it should GET all the parents with no restriction', function (done) {
        var user1 = new User({
            email: 'bla@bla.bla',
            isParent: true,
            password: '123bla456bla',
            username: 'blabla'
        });
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
        var user1 = new User({
            email: 'bla@bla.bla',
            isParent: true,
            password: '123bla456bla',
            username: 'blabla'
        });
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
                    res.body.data[0].should.have.
                        property('username', 'blabla');
                    done();
                });
        });
    });
    it(
        'it should GET parents having children in specified education level',
     function (done) {
        var user1 = new User({
            email: 'bla@bla.bla',
            isParent: true,
            password: '123bla456bla',
            username: 'blabla'
        });
        user1.save(function (err, saved) {
            if (err) {
                return console.log(err);
            }
            chai.request(server).get('/api/User/Search/NA/first/NA/NA/1/10').
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.data[0].should.have.property('children');
                    done();
                });
        });
    }
);
it(
    'it should GET parents having children in specified education system',
 function (done) {
    var user1 = new User({
        email: 'bla@bla.bla',
        isParent: true,
        password: '123bla456bla',
        username: 'blabla'
    });
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
                res.body.data[0].should.have.property('children');
                done();
            });
    });
}
);
it(
    'it should GET parents living in the specified address',
 function (done) {
    var user1 = new User({
        address: 'cairo',
        email: 'bla@bla.bla',
        isParent: true,
        password: '123bla456bla',
        username: 'blabla'
    });
    user1.save(function (err, saved) {
        if (err) {
            return console.log(err);
        }
        chai.request(server).get('/api/User/Search/NA/NA/NA/cairo/1/10').
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                expect(res).to.have.status(200);
                res.body.data.should.be.a('array');
                res.body.data[0].should.have.property('address', 'cairo');
                done();
            });
    });
}
);
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });

});
