var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
// import your schema here, like this:
var Product = mongoose.model('Product');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();

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
var prod1 = new Product({
    // _id: this.Product._id,
    acquiringType: 'rent',
    birthdate: '1/1/1980',
//  createdAt: this.product.createdAt,
    description: 'description',
    image: 'https://vignette.wikia.nocookie.net/spongebob/images/a/ac/Spongebobwithglasses.jpeg/revision/latest?cb=20121014113150',
    name: 'productname',
    price: '500',
    rentPeriod: '2',
    seller: 'omar'
});
// authenticated token
var token = null;

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
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    it('it should PATCH Product from the server', function (done) {
        //here you need to call your schema to construct a document
//like this:
//var cat1 = new Category({
          //  name: 'testcat1',
            //sections: [{ name: 'sec1.1' }]
        //});
        var updatedProd2 = new Product ({
            acquiringType: 'rent',
            birthdate: '1/1/1980',
        //  createdAt: this.product.createdAt,
            description: 'description',
            image: 'https://vignette.wikia.nocookie.net/spongebob/images/a/ac/Spongebobwithglasses.jpeg/revision/latest?cb=20121014113150',
            name: 'productname',
            price: '20',
            rentPeriod: '2',
            seller: 'omar'
        });
//sign up
chai.request(server).
                post('/api/signUp').
                send(user).
                set('Authorization', token).
                end(function (err, response) {
                    if (err) {
                        return console.log(err);
                    }
                    response.should.have.status(201);
                    token = response.body.token;
// save your document with a call to save, cat1 is just the variable name here
        updatedProd2.save(function (err, savedReq) {
            if (err) {
                return console.log(err);
            }
// write your actual test here, like this:
  chai.request(server).patch('/api/productrequest/editPrice/'+ savedReq._id + '/' + user.username).
            send(prod1).
            set('Authorization', token).
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
    });

    it('it should give error ', function (done) {
        //here you need to call your schema to construct a document
//like this:
//var cat1 = new Category({
          //  name: 'testcat1',
            //sections: [{ name: 'sec1.1' }]
//});  
         var updatedProd2 = new Product ({
            acquiringType: 'rent',
            birthdate: '1/1/1980',
        //  createdAt: this.product.createdAt,
            description: 'description',
            image: 'https://vignette.wikia.nocookie.net/spongebob/images/a/ac/Spongebobwithglasses.jpeg/revision/latest?cb=20121014113150',
            name: 'productname',
            price: '20',
            rentPeriod: '2',
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
// save your document with a call to save, cat1 is just the variable name here
        updatedProd2.save(function (err, savedReq) {
            if (err) {
                return console.log(err);
            }
// write your actual test here, like this:
     chai.request(server).patch('/api/productrequest/editPrice/' + savedReq._id + '/' + user.username).
            send(prod1).
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                //200 = ProductRequest was created successfully.
                expect(res).to.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('err').
                    eql('You can only edit your requests');


                    done();
                });
            });
        });
    });
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
 });

    // --- Mockgoose Termination --- //
   // --- End of "Mockgoose Termination" --- //
