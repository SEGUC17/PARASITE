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
var scoreValue = 10;
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
var targetContent = null;
describe('/POST/score/', function () {
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
        cat1.save(function (catError) {
            if (catError) {
                done();
            }
            done();
        });
    });
    before(function (done) {
        chai.request(server).
            post('/api/content').
            set('Authorization', userToken).
            send(testContent).
            end(function (err, res) {
                if (err) {
                    done(err);
                }
                targetContent = res.body.data;
                done();
            });
    });
    it('should add a score of value ' + scoreValue, function (done) {
        chai.request(server).
            post('/api/' + targetContent._id + '/score').
            set('Authorization', userToken).
            send({}).
            end(function (err, res) {
                should.not.exist(err);
                should.exist(res.body.msg);
                done();
            });
    });
});
