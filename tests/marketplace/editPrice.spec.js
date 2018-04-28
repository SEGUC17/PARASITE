
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

var user = new User({
    birthdate: '1/1/1980',
    email: 'omar@omar.omar',
    firstName: 'Omar',
    isEmailVerified: true,
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
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

var updatedProd2 = ({ 
    acquiringType: 'sell',
    description: 'description description description',
    image: 'https://vignette.wikia.nocookie.net/spongebob/images' +
        '/a/ac/Spongebobwithglasses.jpeg/' +
        'revision/latest?cb=20121014113150',
    name: 'product1',
    price: '200',
    seller: 'omar'
});

// //write your test's name below in <write here>
// describe('EditPrice', function () {

//     // --- Mockgoose Initiation --- //
//     before(function (done) {
//         mockgoose.prepareStorage().then(function () {
//             mongoose.connect(config.MONGO_URI, function () {
//                 done();
//             });
//         });
//     });
//     // --- End of "Mockgoose Initiation" --- //

// // authenticated token
// var token = null;
var token = null;

describe('Editing product Price', function () {

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                mockgoose.helper.reset().then(function () {
                    user.save(function (error) {
                        if (error) {
                            throw error;
                        }

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


    it('it should PATCH Product from the server', function (done) {

        Product.create(pro1, function (err, savedReq) {
            if (err) {
                return console.log(err);
            }

            chai.request(server).
                patch('/api/productrequest/editPrice/' + savedReq._id + '/' + user.username).
                set('Authorization', token).
                send(updatedProd2).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').
                        eql('product price updated.');


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
                patch('/api/productrequest/editPrice/' + savedReq._id + '/someIdiotUser').
                set('Authorization', token).
                send(updatedProd2).
                end(function (error, res) {
                    if (error) {
                        return console.log(error);
                    }
                    expect(res).to.have.status(403);
                    res.body.err.should.be.equal('You can only edit your product');
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
// });
