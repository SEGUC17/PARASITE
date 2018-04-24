/*eslint max-statements: ["error", 20]*/
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Product = mongoose.model('Product');
var users = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var User = require('../../api/models/User');


chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

describe('CreateProduct for admin', function () {

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
        var that = this;
        this.johnDoe = {
            address: 'John Address Sample',
            birthdate: '1/1/1980',
            email: 'johndoe@gmail.com',
            firstName: 'John',
            isEmailVerified: true,
            isTeacher: true,
            lastName: 'Doe',
            password: 'JohnPasSWorD',
            phone: '123',
            schedule: [],
            studyPlans: [],
            username: 'john'
        };

        this.token = '';
        mockgoose.helper.reset().then(function () {
            User.create(that.johnDoe, function (err) {
                if (err) {
                    return done(err);
                }

                chai.request(server).
                    post('/api/signIn').
                    send({
                        'password': that.johnDoe.password,
                        'username': that.johnDoe.username
                    }).
                    end(function (err2, res) {
                        if (err2) {
                            return done(err2);
                        }

                        that.token = res.body.token;

                        return done();
                    });
            });
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    it('it should POST Product to Product collection', function (done) {

        var pro1 = new Product({
            acquiringType: 'sell',
            description: 'description description description',
            image: 'https://vignette.wikia.nocookie.net/spongebob/images' +
                '/a/ac/Spongebobwithglasses.jpeg/' +
                'revision/latest?cb=20121014113150',
            name: 'product1',
            price: '11',
            seller: 'john'
        });
        //sign up
        var that = this;
        users.updateOne(
            { username: 'omar' },
            { $set: { isAdmin: true } }, function (err1) {
                if (err1) {
                    return console.log(err1);
                }

                // Testing
                chai.request(server).
                    post('/api/productrequest/createproduct').
                    send(pro1).
                    set('Authorization', that.token).
                    end(function (error, res) {
                        if (error) {
                            return console.log(error);
                        }
                        expect(res).to.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('msg').
                            eql('Product was created successfully.');
                        res.body.data.should.
                            have.property('acquiringType');
                        res.body.data.should.
                            have.property('description');
                        res.body.data.should.have.property('image');
                        res.body.data.should.have.property('name');
                        res.body.data.should.have.property('price');
                        res.body.data.should.have.property('seller');

                        done();
                    });
            }
        );
    });
    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //
});

