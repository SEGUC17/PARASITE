var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Product = mongoose.model('Product');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();
var users = mongoose.model('User');
var User = require('../../api/models/User');

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

var user = new User({
    birthdate: '1/1/1980',
    email: 'omar@omar.omar',
    firstName: 'Omar',
    isAdmin: true,
    isEmailVerified: true,
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
});

var userNonAdmin = new User({
    birthdate: '1/1/1980',
    email: 'omar@omar.owwwmar',
    firstName: 'Omar',
    isAdmin: false,
    isEmailVerified: true,
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'NotAdmin'
});

var pro1 = new Product({
    acquiringType: 'sell',
    description: 'description description description',
    image: 'https://vignette.wikia.nocookie.net/spongebob/images' +
        '/a/ac/Spongebobwithglasses.jpeg/' +
        'revision/latest?cb=20121014113150',
    name: 'product1',
    price: '11',
    seller: 'omar'
});

var token = null;

//write your test's name below in <write here>
describe('deleteProduct', function () {
    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                mockgoose.helper.reset().then(function () {
                    user.save(function (error) {
                        if (error) {
                            throw error;
                        }

                        userNonAdmin.save();

                        //sign in
                        chai.request(server).
                            post('/api/signIn').
                            send({
                                'password': '123456789',
                                'username': 'omar'
                            }).
                            end(function (err, response) {
                                if (err) {
                                    return console.log(err);
                                }
                                expect(response).to.have.status(200);
                                token = response.body.token;
                                // save your document with a call to save
                                done();
                            });
                    });
                });
            });
        });
    });
    // --- End of "Mockgoose Initiation" --- //
    // --- End of "Clearing Mockgoose" --- //
    it('it should Delete Product from the server', function (done) {
        // write your actual test here, like this:
        pro1.save(function (err, savedReq) {
            if (err) {
                return console.log(err);
            }
            chai.request(server).
                patch('/api/productrequest/deleteProduct/').
                send({ product: { _id: savedReq._id } }).
                set('Authorization', token).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    //200 = ProductRequest was created successfully.
                    expect(res).to.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').
                        eql('Product was deleted successfully.');
                    done();
                });
        });
    });
    it('it should give error ', function (done) {
        pro1.save(function (err, savedReq) {
            if (err) {
                return console.log(err);
            }
            chai.request(server).
                post('/api/signIn').
                send({
                    'password': '123456789',
                    'username': 'NotAdmin'
                }).
                end(function (err, response) {
                    if (err) {
                        return console.log(err);
                    }
                    expect(response).to.have.status(200);
                    token = response.body.token;
                    // save your document with a call to save

                    chai.request(server).
                        patch('/api/productrequest/deleteProduct/').
                        set('Authorization', token).
                        send({ product: { _id: savedReq._id } }).
                        end(function (error, res) {
                            if (error) {
                                return console.log(error);
                            }
                            expect(res).to.have.status(403);
                            res.body.err.should.be.equal('You are not an admin to do that.');
                            done();
                        });
                });
        });
    });
    after(function (done) {
        mockgoose.helper.reset().then(function () {
            mongoose.connection.close(function () {
                done();
            });
        });
    });
});
