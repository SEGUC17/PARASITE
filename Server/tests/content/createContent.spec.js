
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Content = mongoose.model('Content');
var Category = mongoose.model('Category');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

describe('/POST/content/', function () {
    var userToken = null;
    var cat1 = new Category({
        name: 'testcat1',
        sections: [{ name: 'sec1.1' }]
    });
    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });
    // --- End of "Mockgoose Initiation" --- //
    // --- Sign up a new user --//
    before(function (done) {
        chai.request(server).post('/api/signUp').
            send({
                birthdate: '11/11/1997',
                email: 'hello@hello1234.com',
                firstName: 'Reda',
                lastName: 'Ramadan',
                password: 'testing123',
                username: 'Hellothere'
            }).
            end(function (err, res) {
                if (err) {
                    done();
                }
                userToken = res.body.token;

                cat1.save(function (catError) {
                    if (catError) {
                        done();
                    }
                    done();
                });

            });
    });
    it('should create new content successfully,with false ' +
        'approval status, and a new content request', function (done) {
            var testContent = function (res, content) {
                content.body.should.be.a('string').
                    equal('hello there');
                content.category.should.be.a('string').
                    equal(cat1.name);
                content.section.should.be.a('string').
                    equal(cat1.sections[0].name);
                content.title.should.be.a('string').
                    equal('test title');
            };
            var testRequest = function (res, contentRequest) {
                contentRequest.contentTitle.should.be.a('string').
                    equal('test title');
                contentRequest.requestType.should.be.a('string').
                    equal('create');
            };
            chai.request(server).
                post('/api/content').
                set('Authorization', userToken).
                send({
                    body: 'hello there',
                    category: cat1.name,
                    creator: 'Hellothere',
                    section: cat1.sections[0].name,
                    title: 'test title'
                }).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(201);
                    should.exist(res.body.data.content);
                    should.exist(res.body.data.request);
                    var content = res.body.data.content;
                    testContent(res, content);
                    var contentRequest = res.body.data.request;
                    testRequest(res, contentRequest);
                    done();
                });
        });

    // --- Clearing Mockgoose --- //
    after(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //


});
