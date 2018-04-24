var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
// import your schema here, like this:
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


//write your test's name below in <write here>
describe('EditPrice', function () {

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
        this.janeDoe = {
            address: 'Jane Address Sample',
            birthdate: '1/1/2000',
            email: 'janedoe@gmail.com',
            firstName: 'Jane',
            isTeacher: true,
            lastName: 'Doe',
            password: 'JanePasSWorD',
            phone: '123',
            schedule: [],
            studyPlans: [],
            username: 'jane'
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


    it('it should PATCH Product from the server', function (done) {
        //here you need to call your schema to construct a document
        var updatedProd2 = new Product({
            acquiringType: 'sell',
            description: 'description description description',
            image: 'https://vignette.wikia.nocookie.net/spongebob/images' +
                '/a/ac/Spongebobwithglasses.jpeg/' +
                'revision/latest?cb=20121014113150',
            name: 'product1',
            price: '200',
            seller: 'john'
        });
        //sign up
        var that = this;
        users.updateOne(
            { username: 'john' },
            { $set: { isAdmin: true } }, function (err1) {
                if (err1) {
                    return console.log(err1);
                }

                chai.request(server).
                    send(this.johnDoe).
                    set('Authorization', that.token).
                    end(function (err, response) {
                        if (err) {
                            return console.log(err);
                        }
                        response.should.have.status(201);
                        that.token = response.body.token;
                        // save your document with a call to save, cat1 is just the variable name here
                        updatedProd2.save(function (err, savedReq) {
                            if (err) {
                                return console.log(err);
                            }
                            // write your actual test here, like this:
                            chai.request(server).
                            patch('/api/productrequest/editPrice/' + savedReq._id + '/' + that.johnDoe.username).
                                send(pro1).
                                set('Authorization', that.token).
                                end(function (error, res) {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    //200 = ProductRequest was created successfully.
                                    expect(res).to.have.status(201);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('msg').
                                        eql('product price updated.');


                                    done();
                                });
                        });
                    });
            }
        );
    });

    it('it should give error ', function (done) {

        var updatedProd2 = new Product({
            acquiringType: 'sell',
            description: 'description description description',
            image: 'https://vignette.wikia.nocookie.net/spongebob/images' +
                '/a/ac/Spongebobwithglasses.jpeg/' +
                'revision/latest?cb=20121014113150',
            name: 'product1',
            price: '200',
            seller: 'jane'
        });
        //sign up
        var that = this;
        users.updateOne(
            { username: 'jane' }, //should this be ahmed?
            { $set: { isAdmin: true } }, function (err1) {
                if (err1) {
                    return console.log(err1);
                }

                chai.request(server).
                    send(this.johnDoe). //should this be jane?
                    set('Authorization', that.token).
                    end(function (err, response) {
                        if (err) {
                            return console.log(err);
                        }
                        response.should.have.status(201);
                        that.token = response.body.token;
                        // save your document with a call to save, cat1 is just the variable name here
                        updatedProd2.save(function (err, savedReq) {
                            if (err) {
                                return console.log(err);
                            }
                            // write your actual test here, like this:
                            chai.request(server).
                            patch('/api/productrequest/editPrice/' + savedReq._id + '/' + that.johnDoe.username).
                                send(updatedProd2).
                                set('Authorization', that.token).
                                end(function (error, res) {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    expect(res).to.have.status(403);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('err').
                                        eql('You can only edit your product');


                                    done();
                                });
                        });
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
// });
