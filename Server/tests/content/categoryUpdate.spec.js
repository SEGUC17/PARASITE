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
var testCategory = null;
var successUpdate = {
    iconLink: 'http://www.this-is-a-link-update.com',
    name: 'updatedCategory'
};
var failCategoryNameExists = {
    iconLink: 'http://www.this-is-a-link.com',
    name: null
};
var failCategoryNameValid = {
    iconLink: 'http://www.this-is-a-link.com',
    name: {}
};
var failCategoryIconExists = {
    iconLink: null,
    name: 'testCategory'
};
var failCategoryIconValid = {
    iconLink: {},
    name: 'testCategory'
};

describe('/PATCH/category', function () {
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
    it('should update the category successfully', function (done) {
        chai.request(server).
            patch('/api/content/category/' + testCategory._id).
            set('Authorization', adminToken).
            send(successUpdate).
            end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.msg.should.equal('updated category and' +
                    'associated content successfully');
                done();
            });
    });
    it('should fail to update category ' +
        'because the user is unregistered', function (done) {
            chai.request(server).
                patch('/api/content/category/' + testCategory._id).
                send(successUpdate).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(401);
                    done();
                });
        });
    it('should fail to update category ' +
        'because the user is not an admin', function (done) {
            chai.request(server).
                patch('/api/content/category/' + testCategory._id).
                set('Authorization', userToken).
                send(successUpdate).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(403);
                    done();
                });
        });
    it('should fail to update category ' +
        'because name was not supplied', function (done) {
            chai.request(server).
                patch('/api/content/category/' + testCategory._id).
                set('Authorization', adminToken).
                send(failCategoryNameExists).
                end(function (err, res) {
                    res.should.have.status(422);
                    should.not.exist(err);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.equal('No category supplied');
                    done();
                });
        });
    it('should fail to update category ' +
        'because the name supplied is invalid', function (done) {
            chai.request(server).
                patch('/api/content/category/' + testCategory._id).
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
    it('should fail to update category' +
        'because the iconLink was not supplied', function (done) {
            chai.request(server).
                patch('/api/content/category/' + testCategory._id).
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
    it('should fail to update category ' +
        'because the iconLink was invalid', function (done) {
            chai.request(server).
                patch('/api/content/category/' + testCategory._id).
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
});
