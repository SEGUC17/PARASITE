/*eslint max-statements: ["error", 20]*/
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
// import your schema here, like this:
var Product = mongoose.model('Product');
var users = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

// user for authentication
var user = {
    birthdate: '1/1/1980',
    email: 'omar@omar.omar',
    firstName: 'omar',
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
};

// authenticated token
var token = null;

//write your test's name below in <write here>
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
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    it('it should POST Product to Product collection', function (done) {

        var pro1 = new Product({
            acquiringType: 'sell',
            description: 'description description description',
            image: 'https://vignette.wikia.nocookie.net/spongebob/images' +
            '/a/ac/Spongebobwithglasses.jpeg/revision/latest?cb=20121014113150',
            name: 'product1',
            price: '11',
            seller: 'omar'
        });
        //sign up
        chai.request(server).
            post('/api/signUp').
            send(user).
            end(function (err, response) {
                if (err) {
                    return console.log(err);
                }
                response.should.have.status(201);
                token = response.body.token;
                //here for admin
                users.updateOne(
                    { username: 'omar' },
                 { $set: { isAdmin: true } }, function (err1) {
                    if (err1) {
                        return console.log(err1);
                    }

                    //commented bec. it inserts twice
                    // pro1.save(function (err) {
                    //     if (err) {
                    //         return console.log(err);
                    //     }

                    // write your actual test here, like this:
                    chai.request(server).
                        post('/api/productrequest/createproduct').
                        send(pro1).
                        end(function (error, res) {
                            if (error) {
                                return console.log(error);
                            }
                            expect(res).to.have.status(201);
                            res.body.should.be.a('object');
                            res.body.should.have.property('msg').
                            eql('Product was created successfully.');
                            res.body.data.should.have.property('acquiringType');
                            res.body.data.should.have.property('description');
                            res.body.data.should.have.property('image');
                            res.body.data.should.have.property('name');
                            res.body.data.should.have.property('price');
                            res.body.data.should.have.property('seller');

                            done();
                        });
                }
            );
            });
    });
    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //
    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //
});
