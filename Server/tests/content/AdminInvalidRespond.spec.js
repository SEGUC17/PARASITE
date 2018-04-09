
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var expect = chai.expect;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nawwar');
var db = mongoose.connection;
var users = mongoose.model('User');
var contReq = mongoose.model('ContentRequest');
var cont = mongoose.model('Content');
chai.use(chaiHttp);
var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var adminToken = null;

var adminUser = {
    birthdate: '2/6/1999',
    email: 'salma@salmaa.admin',
    firstName: 'adminsalma',
    isAdmin: true,
    lastName: 'adminsalma',
    password: 'adminsalma',
    phone: 23456,
    username: 'adminsalma'
};
describe('Invalid and non-existing inputs', function() {
 // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                console.log('mongoose connected');
                done();
            });
        });
    });
    // --- Clearing Mockgoose --- //
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            console.log('mockgoose is clear');
            done();
        });
    });

    beforeEach(function(done) {
        chai.request(server).
        post('/api/signUp').
        send(adminUser).
        end(function (err, response) {

        if (err) {
            console.log(err);

            return console.log(err);
        }
        response.should.have.status(201);
        adminToken = response.body.token;
        users.updateOne(
            { username: 'adminsalma' },
            { $set: { isAdmin: true } },
                function (err1) {
        if (err1) {
            console.log(err1);
        }
    }
);
        done();

            });
   });
    describe('NonExistent/Invalid requests tests', function() {

        it(
        'Non-existent query should display error 404(nonexistent Content)',
        function(done) {
            var Cont = new cont({
                _id: '5aca0d4d8865fc24fe140713',
                approved: false,
                body: 'this is the body',
                category: 'this is a category',
                creator: 'salma',
                section: 'this is a section',
                title: 'this is a title',
                type: 'idea'
            });
            Cont.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
            chai.request(server).
            patch('/api/admin/RespondContentStatus/' +
            '5aca0d4d8865fc24fe140714').
            send({ str: false }).
            set('Authorization', adminToken).
            end(function(err, res) {
                if (!err === null) {
                    console.log(err);
                }
                should.exist(res);
                res.should.have.property('body');
                res.should.have.status(404);
                res.body.err.should.be.a('string');
                expect(res.body.data).to.equal(null);
                expect(res.body.err).to.equal('Content not found');
                done();
            });
        }
    );
            it(
            'Non-existent query should display error 404' +
            '(nonexistent ContentRequest)',
            function(done) {
                var ContReq = new contReq({
                _id: '5aca0d4d8865fc24fe140712',
                contentType: 'resource',
                createdOn: '1/1/1111',
                creator: 'salma',
                requestType: 'create'
            });
            ContReq.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });

            chai.request(server).
            patch('/api/admin/RespondContentRequest/' +
            '5aca0d4d8865fc24fe14071a').
            send({ str: false }).
            set('Authorization', adminToken).
            end(function(err, res) {
                if (!err === null) {
                    console.log(err);
                }
                should.exist(res);
                res.should.have.property('body');
                res.should.have.status(404);
                res.body.err.should.be.a('string');
                expect(res.body.data).to.equal(null);
                expect(res.body.err).to.equal('Request not found');
                done();
            });
        }
    );
    it(
    'Invalid requestId should display error 422' +
    '(On invalid ObjectId Of Request)',
    function(done) {
        var ContReq = new contReq({
            _id: '5aca0d4d8865fc24fe140719',
            contentType: 'resource',
            createdOn: '1/1/1111',
            creator: 'salma',
            requestType: 'create'
        });
        ContReq.save(function(err) {
            if (err) {
                console.log(err);
            }
        });
        chai.request(server).
        patch('/api/admin/RespondContentRequest/' +
        '1').
        send({ str: false }).
        set('Authorization', adminToken).
        end(function(err, res) {
            if (!err === null) {
                console.log(err);
            }
            should.exist(res);
            res.should.have.property('body');
            res.should.have.status(422);
            res.body.err.should.be.a('string');
            expect(res.body.data).to.equal(null);
            expect(res.body.err).to.equal('The Request Id is not valid');
            done();
        });
    }
);
    it(
        'Invalid requestId should display error 422' +
        '(On invalid ObjectId Of Content)',
        function(done) {
            var Cont = new cont({
                _id: '5aca0d4d8865fc24fe140715',
                approved: false,
                body: 'this is the body',
                category: 'this is a category',
                creator: 'salma',
                section: 'this is a section',
                title: 'this is a title',
                type: 'idea'
            });
            Cont.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
            chai.request(server).
        patch('/api/admin/RespondContentStatus/' +
        '1').
        send({ str: false }).
        set('Authorization', adminToken).
        end(function(err, res) {
            if (!err === null) {
                console.log(err);
            }
            should.exist(res);
            res.should.have.property('body');
            res.should.have.status(422);
            res.body.err.should.be.a('string');
            expect(res.body.data).to.equal(null);
            expect(res.body.err).to.equal('The Content Id is not valid');
            done();
        });
    }
);
});
            // --- Mockgoose Termination --- //
  after(function (done) {
    mongoose.connection.close(function () {
        done();
        console.log('mockgoose closing the connection');
        });
    });

});
