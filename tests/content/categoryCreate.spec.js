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
var failCategoryNameExists = {
    category: null,
    iconLink: 'http://www.this-is-a-link.com'
};
var failCategoryNameValid = {
    category: {},
    iconLink: 'http://www.this-is-a-link.com'
};
var failCategoryIconExists = {
    category: 'testCategory',
    iconLink: null
};
var failCategoryIconValid = {
    category: 'testCategory',
    iconLink: {}
};
describe('/POST/category/', function () {
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
            end(function (err) {
                if (err) {
                    done();
                }
                User.findOneAndUpdate(
                    { username: 'Hellothere' },
                    { $set: { isEmailVerified: true } },
                    function (updateError, user) {
                        if (updateError) {
                            done();
                        }
                        chai.request(server).
                            post('/api/signin').
                            send({
                                password: 'testing123',
                                username: user.username
                            }).
                            end(function (loginError, loginRes) {
                                if (loginError) {
                                    done(loginError);
                                }
                                // get the first test user token
                                userToken = loginRes.body.token;
                                done();
                            });


                    }
                );


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
            end(function (err) {
                if (err) {
                    done();
                }
                // update user permissions
                User.findOneAndUpdate(
                    { username: 'admin' },
                    {
                        $set:
                            {
                                isAdmin: true,
                                isEmailVerified: true
                            }
                    },
                    function (updateErr, user) {
                        if (updateErr) {
                            done();
                        }
                        chai.request(server).
                            post('/api/signin').
                            send({
                                password: 'admin123',
                                username: user.username
                            }).
                            end(function (loginError, loginRes) {
                                if (loginError) {
                                    done(loginError);
                                }
                                // get the first test user token
                                adminToken = loginRes.body.token;
                                done();
                            });
                    }
                );
            });
    });
    it('should create a new category successsfully', function (done) {
        chai.request(server).
            post('/api/content/category').
            set('Authorization', adminToken).
            send(successCategory).
            end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(201);
                should.exist(res.body.data);
                res.body.msg.should.be.equal('Category was ' +
                    'created successfully');
                done();
            });
    });
    it('should fail to create new category ' +
        'because the user is unregistered', function (done) {
            chai.request(server).
                post('/api/content/category').
                send(successCategory).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(401);
                    done();
                });
        });
    it('should fail to create new category ' +
        'because the user is not an admin', function (done) {
            chai.request(server).
                post('/api/content/category').
                set('Authorization', userToken).
                send(successCategory).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(403);
                    done();
                });
        });
    it('should fail to create new category ' +
        'because name was not supplied', function (done) {
            chai.request(server).
                post('/api/content/category').
                set('Authorization', adminToken).
                send(failCategoryNameExists).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(422);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.equal('No category supplied');
                    done();
                });
        });
    it('should fail to create new category ' +
        'because the name supplied is invalid', function (done) {
            chai.request(server).
                post('/api/content/category').
                set('Authorization', adminToken).
                send(failCategoryNameValid).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(422);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.equal('category type is invalid');
                    done();
                });
        });
    it('should fail to create new category ' +
        'because the iconLink was not supplied', function (done) {
            chai.request(server).
                post('/api/content/category').
                set('Authorization', adminToken).
                send(failCategoryIconExists).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(422);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.equal('No icon link supplied');
                    done();
                });
        });
    it('should fail to create new category ' +
        'because the iconLink was invalid', function (done) {
            chai.request(server).
                post('/api/content/category').
                set('Authorization', adminToken).
                send(failCategoryIconValid).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(422);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.equal('icon link type is invalid');
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
