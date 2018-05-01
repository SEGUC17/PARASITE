var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var User = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();

chai.use(chaiHttp);
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var route = require('../../api/routes/index');

describe('/PATCH/ ChildrenIndependence', function () {
    this.timeout(120000);
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
    // --- End of "Clearing Mockgoose" --- /

    it('it should turn isChild of user to false', function (done) {

        var child = new User({
            address: 'Mars',
            birthdate: '2000-11-10T22:00:00.000Z',
            children: [],
            email: 'child@gmail.com',
            firstName: 'fisrt',
            isChild: true,
            lastName: 'last',
            password: '12345678',
            phone: '012134266',
            username: 'childUsername'

        });
       child.save(function (err, savedCategory) {
            if (err) {
                return console.log(err);
            }
// testing patch request
   chai.request(server).
   patch('/api/profile/' +
        savedCategory.username + '/EditChildIndependence').
        send(savedCategory).
                   end(function (error, res) {
                    if (error) {
                        return error;
                    }

                    expect(res).to.have.status(200);
                    res.body.data.should.be.a('boolean');
         res.body.should.have.property('msg').
        eql('Successefully changed from child to independent.');
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
