/*eslint max-statements: ["error", 20]*/
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var ProductRequest = mongoose.model('ProductRequest');
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

describe('createProductRequest', function () {
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
    // --- End of "Clearing Mockgoose" --- //


    it('it should POST productrequests', function (done) {
        // Calling the schema to construct a document

        var pro1 = new ProductRequest({
            acquiringType: 'sell',
            description: 'description description description',
            image: 'https://vignette.wikia.nocookie.net/spongebob/images/' +
                'a/ac/Spongebobwithglasses.jpeg/revision/latest?cb=20121014113150',
            name: 'product2',
            price: 11,
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

                // Testing

                chai.request(server).
                    post('/api/productrequest/createProductRequest').
                    send(pro1).
                    end(function (error, res) {
                        if (error) {
                            return console.log(error);
                        }
                        //200 = ProductRequest was created successfully.
                        expect(res).to.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('msg').
                            eql('ProductRequest was created successfully.');
                        res.body.data.should.have.property('acquiringType');
                        res.body.data.should.have.property('description');
                        res.body.data.should.have.property('image');
                        res.body.data.should.have.property('name');
                        res.body.data.should.have.property('price');
                        res.body.data.should.have.property('seller');

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
