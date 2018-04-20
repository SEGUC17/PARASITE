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
var failCategoryName = {
    category: null,
    iconLink: 'http://www.this-is-a-link.com'
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
