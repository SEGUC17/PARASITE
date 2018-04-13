/*eslint max-statements: ["error", 10, { "ignoreTopLevelFunctions": true }]*/
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
var Category = mongoose.model('Category');
var Content = mongoose.model('Content');
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
    name: 'testcat1',
    sections: [{ name: 'sec1.1' }]
});
var testContent = new Content({
    approved: true,
    body: 'hello there',
    category: cat1.name,
    creator: 'Hellothere',
    section: cat1.sections[0].name,
    title: 'test title'
});
describe('/PATCH /content', function () {
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
            end(function (err, res) {
                if (err) {
                    return done(err);
                }
                // get the first test user token
                userToken = res.body.token;
                done();
            });
    });
    before(function (done) {
        cat1.save(function (catError) {
            if (catError) {
                return done(catError);
            }
            done();
        });
    });
    before(function (done) {
        testContent.save(function (contentError) {
            if (contentError) {
                return done(contentError);
            }
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
                            done(updateErr);
                        }
                        // get the token for the second test user
                        adminToken = res.body.token;
                        done();
                    }
                );
            });
    });

    it(
        'should update content successfully for an admin' +
        ' with true approval status' +
        ' and no content request is generated',
        function (done) {
            //deep clone the test content
            var updatedContent = JSON.parse(JSON.stringify(testContent));
            updatedContent.title = 'hello, this is an update';
            chai.request(server).
                patch('/api/content').
                set('Authorization', adminToken).
                send(updatedContent).
                end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    should.exist(res.body.data);
                    should.not.exist(res.body.data.content);
                    should.not.exist(res.body.data.contentRequest);
                    res.body.data.body.should.
                        be.equal('hello, this is an update');
                    done();
                });

        }
    );
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

