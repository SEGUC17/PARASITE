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
var cat1 = new Category({
    iconLink: 'this-is-a-link.com',
    name: 'testcat1',
    sections: [
        {
            iconLink: 'this-is-a-link.com',
            name: 'sec1.1'
        }
    ]
});
var testContent = {
    body: 'hello there',
    category: cat1.name,
    creator: 'Hellothere',
    section: cat1.sections[0].name,
    title: 'test title'
};
describe('/POST/content/', function () {
    var validateContent = function (content, isAdmin) {
        should.exist(content.approved);
        if (isAdmin) {
            content.approved.should.be.equal(true);
        } else {
            content.approved.should.be.equal(false);
        }
        content.body.should.be.a('string').
            equal(testContent.body);
        content.category.should.be.a('string').
            equal(cat1.name);
        content.section.should.be.a('string').
            equal(cat1.sections[0].name);
        content.title.should.be.a('string').
            equal(testContent.title);
    };
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
    before(function (done) {
        cat1.save(function (catError) {
            if (catError) {
                done();
            }
            done();
        });
    });
    it('should create new content successfully,with false ' +
        'approval status, and a new content request', function (done) {

            var validateRequest = function (res, contentRequest) {
                contentRequest.contentTitle.should.be.a('string').
                    equal('test title');
                contentRequest.requestType.should.be.a('string').
                    equal('create');
            };
            chai.request(server).
                post('/api/content').
                set('Authorization', userToken).
                send(testContent).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(201);
                    should.exist(res.body.data.content);
                    should.exist(res.body.data.request);
                    var content = res.body.data.content;
                    validateContent(content, false);
                    var contentRequest = res.body.data.request;
                    validateRequest(res, contentRequest);
                    done();
                });
        });
    it(
        'should create new content successfully,with true ' +
        'approval status, and no new content request is added',
        function (done) {
            chai.request(server).
                post('/api/content').
                set('Authorization', adminToken).
                send(testContent).
                end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(201);
                    should.exist(res.body.data);
                    should.not.exist(res.body.data.content);
                    should.not.exist(res.body.data.request);
                    var content = res.body.data;
                    validateContent(content, true);
                    done();
                });
        }
    );

    it('should fail to create new content successfully,' +
        ' because of invalid metadata', function (done) {

            chai.request(server).
                post('/api/content').
                set('Authorization', userToken).
                send({ body: 'hello' }).
                end(function (err, res) {
                    if (err) {
                        done();
                    }
                    res.should.have.status(422);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.equal('content metadata' +
                        ' is not supplied');
                    done();
                });
        });

    it('should fail to create new content successfully,' +
        ' because of invalid category', function (done) {
            chai.request(server).
                post('/api/content').
                set('Authorization', userToken).
                send({
                    body: 'hello there',
                    category: 'invalid cat',
                    creator: 'Hellothere',
                    section: 'invalid sec',
                    title: 'test title'
                }).
                end(function (err, res) {
                    if (err) {
                        done();
                    }
                    res.should.have.status(422);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.equal('the category' +
                        ' supplied is invalid');
                    done();
                });
        });

    it('should fail to create new content successfully,' +
        ' because of invalid section', function (done) {
            chai.request(server).
                post('/api/content').
                set('Authorization', userToken).
                send({
                    body: 'hello there',
                    category: cat1.name,
                    creator: 'Hellothere',
                    section: 'invalid sec',
                    title: 'test title'
                }).
                end(function (err, res) {
                    if (err) {
                        done();
                    }
                    res.should.have.status(422);
                    should.not.exist(res.body.data);
                    res.body.err.should.be.equal('the section' +
                        ' supplied is invalid');
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
