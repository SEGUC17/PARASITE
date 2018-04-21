/*eslint max-statements: ["error", 10, { "ignoreTopLevelFunctions": true }]*/
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Category = mongoose.model('Category');
var User = mongoose.model('User');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var userToken = null;
var adminToken = null;
var successCategory = {
    category: 'testCategory',
    iconLink: 'http://www.this-is-a-link.com'
};
var successSection = {
    iconLink: 'http://www.this-is-a-link.com',
    section: 'testSection'
};
var failSectionNameExists = {
    iconLink: 'http://www.this-is-a-link.com',
    section: ''
};
var failSectionNameValid = {
    iconLink: 'http://www.this-is-a-link.com',
    section: {}
};
var failSectionIconExists = {
    iconLink: '',
    section: 'testSection'
};

var failSectionIconValid = {
    iconLink: {},
    section: 'testSection'
};
var testCategory = null;
describe('/POST/section/', function () {
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
        //create the first test user(normal permissions)
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
                // get the first test user token
                userToken = res.body.token;
                done();
            });
    });
    before(function (done) {
        //create the second test user(admin permissions)
        chai.request(server).post('/api/signUp').
            send({
                birthdate: '11/11/1997',
                email: 'admin@admin.com',
                firstName: 'admin',
                lastName: 'admin',
                password: 'admin123',
                username: 'admin'
            }).
            end(function (err, res) {
                if (err) {
                    done();
                }
                // update user permissions
                User.updateOne(
                    { username: 'admin' },
                    { $set: { isAdmin: true } },
                    function (updateErr) {
                        if (updateErr) {
                            done();
                        }
                        // get the token for the second test user
                        adminToken = res.body.token;
                        done();
                    }
                );
            });
    });

    before(function (done) {
        chai.request(server).
            post('/api/content/category').
            set('Authorization', adminToken).
            send(successCategory).
            end(function (err, res) {
                if (err) {
                    done(err);
                }
                testCategory = res.body.data;
                done();
            });
    });

    it('should create a new section successfully', function (done) {
        chai.request(server).
            post('/api/content/category/' +
                testCategory._id + '/section').
            set('Authorization', adminToken).
            send(successSection).
            end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(201);
                var targetSections = res.body.data.sections.
                    filter(function (section) {
                        return section.name === successSection.section;
                    });
                targetSections.should.have.lengthOf(1);
                targetSections[0].iconLink.should.be.
                    equal(successSection.iconLink);
                done();
            });

    });

    it('should fail to create new section' +
        'because category id was not supplied', function (done) {
            chai.request(server).
                post('/api/content/category/' +
                    null + '/section').
                set('Authorization', adminToken).
                send(successSection).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(422);
                    res.body.err.should.be.
                        equal('The category is not supplied');
                    done();
                });
        });

    it('should fail to create new section' +
        'because category id supplied was invalid', function (done) {
            chai.request(server).
                post('/api/content/category/notId/section').
                set('Authorization', adminToken).
                send(successSection).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(422);
                    res.body.err.should.be.
                        equal('The category id supplied is invalid');
                    done();
                });
        });
    it('should fail to create new section ' +
        'because the iconLink was not supplied', function (done) {
            chai.request(server).
                post('/api/content/category/' +
                    testCategory._id + '/section').
                set('Authorization', adminToken).
                send(failSectionIconExists).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(422);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.equal('No icon link supplied');
                    done();
                });
        });
    it('should fail to create new section ' +
        'because the iconLink was invalid', function (done) {
            chai.request(server).
                post('/api/content/category/' +
                    testCategory._id + '/section').
                set('Authorization', adminToken).
                send(failSectionIconValid).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(422);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.equal('icon link type is invalid');
                    done();
                });
        });
    it('should fail to create new section ' +
        'because name was not supplied', function (done) {
            chai.request(server).
                post('/api/content/category/' +
                    testCategory._id + '/section').
                set('Authorization', adminToken).
                send(failSectionNameExists).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(422);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.equal('The section is not supplied');
                    done();
                });
        });
    it('should fail to create new category ' +
        'because the name supplied is invalid', function (done) {
            chai.request(server).
                post('/api/content/category/' +
                    testCategory._id + '/section').
                set('Authorization', adminToken).
                send(failSectionNameValid).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(422);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.
                    equal('The section value is invalid');
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

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });

});
