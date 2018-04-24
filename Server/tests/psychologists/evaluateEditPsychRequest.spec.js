/* eslint-disable max-len */
/* eslint-disable max-statements */
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
// import your schema here, like this:
var psychRequests = mongoose.model('PsychologistRequest');
var Psychologist = mongoose.model('Psychologist');
var users = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = chai.should();
var User = mongoose.model('User');

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

// user for authentication
var user = new User({
    address: 'somewhere',
    birthdate: '1/1/1997',
    email: 'mariam@m.com',
    firstName: 'mariam',
    isAdmin: true,
    isEmailVerified: true,
    lastName: 'mahran',
    password: '12345678',
    phone: '01035044431',
    username: 'marioma'
});


// Test request
var editPsychReqTest = null;

var psychologist = new Psychologist({
    address: 'here',
    daysOff:
        [
            'sat',
            'sun'
        ],
    email: 'blah@blah.com',
    firstName: 'mariam',
    lastName: 'mahran',
    phone: '010101',
    priceRange: 1000
});


// authenticated token
var token = null;

// Testing the cases of evaluating as an admin
describe('Evaluate Psychologists\' Edit Requests', function () {

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });
    // --- End of "Mockgoose Initiation" --- //
    before(function (done) {
        chai.request(server).
        post('/api/signIn').
        send({
            'password': '12345678',
            'username': 'marioma'
        }).
        end(function (err2, response) {
            if (err2) {
                return console.log(err2);
            }
            response.should.have.status(200);
            token = response.body.token;
        });
        done();
    });

    before(function (done) {
            user.save(function (err) {
                if (err) {
                    throw err;
                }
                done();
            });
    });


    beforeEach(function (done) {
        psychologist.save(function(err) {
            if (err) {
                console.log(err);
            }
            psychRequests.create({
            address: 'Some address',
            createdAt: new Date(),
            daysOff: [
                'Sat',
                'Sun'
            ],
            email: 'mariam@mariam.com',
            firstName: 'Mariam',
            lastName: 'Mahran',
            phone: '012412414',
            priceRange: 124,
            type: 'edit'
            }, function (err1, req) {
                if (err1) {
                    console.log(err1);
                }
                editPsychReqTest = req;
                done();
            });
        });
    });

    it('Request should be accepted', function (done) {
        var acceptedReq = {
            _id: editPsychReqTest._id,
            address: 'Some address',
            createdAt: new Date(),
            daysOff: [
                'Sat',
                'Sun'
            ],
            editID: psychologist._id,
            email: 'mariam@mariam.com',
            firstName: 'Mariam',
            lastName: 'Mahran',
            phone: '012412414',
            priceRange: 124,
            result: true,
            type: 'edit'
        };

        chai.request(server).
            post('/api/psychologist/request/evalRequest').
            send(acceptedReq).
            set('Authorization', token).
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                expect(res).to.have.status(200);
                res.body.msg.should.be.equal('Request accepted and psychologist was updated successfully.');
                done();
            });
    });
    it('Request should be rejected', function (done) {
        var rejectedReq = {
            _id: editPsychReqTest._id,
            address: 'Some address',
            createdAt: new Date(),
            daysOff: [
                'Sat',
                'Sun'
            ],
            editID: psychologist._id,
            email: 'mariam@mariam.com',
            firstName: 'Mariam',
            lastName: 'Mahran',
            phone: '012412414',
            priceRange: 124,
            result: false,
            type: 'edit'
        };

        chai.request(server).
            post('/api/psychologist/request/evalRequest').
            send(rejectedReq).
            set('Authorization', token).
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                expect(res).to.have.status(201);
                res.body.msg.should.be.equal('Request rejected and applicant notified.');
                done();
            });
    });
    it('Request result was true but not found.(404)', function (done) {
        editPsychReqTest.result = true;

        chai.request(server).
            post('/api/psychologist/request/evalRequest').
            send({ _id: '2930ri2390ri3934t8' }).
            set('Authorization', token).
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                expect(res).to.have.status(404);
                res.body.msg.should.be.equal('Request not found.');
                done();
            });
    });
    it('Request result was false but not found.(404)', function (done) {
        editPsychReqTest.result = false;

        chai.request(server).
            post('/api/psychologist/request/evalRequest').
            send({ _id: '2930ri2390ri3934t8' }).
            set('Authorization', token).
            end(function (error, res) {
                if (error) {
                    return console.log(error);
                }
                expect(res).to.have.status(404);
                res.body.msg.should.be.equal('Request not found.');
                done();
            });
    });

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //

});

// // Testing for no-user and non-admin case
// describe('Evaluate Edit Psychologist Request By Non Admin', function () {

//     // --- Mockgoose Initiation --- //
//     before(function (done) {
//         mockgoose.prepareStorage().then(function () {
//             mongoose.connect(config.MONGO_URI, function () {
//                 done();
//             });
//         });
//     });
//     // --- End of "Mockgoose Initiation" --- //

//     // --- Clearing Mockgoose --- //
//     beforeEach(function (done) {
//         mockgoose.helper.reset().then(function () {
//             done();
//         });
//     });
//     // --- End of "Clearing Mockgoose" --- //

//     it('Request should NOT be evaluated', function (done) {

//         //sign up
//         chai.request(server).
//             post('/api/signUp').
//             send(user).
//             end(function (err, response) {
//                 if (err) {
//                     return console.log(err);
//                 }
//                 response.should.have.status(201);
//                 token = response.body.token;

//                 // save your document with a call to save
//                 editPsychReqTest.save(function (err1) {
//                     if (err1) {
//                         return console.log(err1);
//                     }

//                     editPsychReqTest.result = true;

//                     chai.request(server).
//                         post('/api/psychologist/request/evalRequest').
//                         send(editPsychReqTest).
//                         set('Authorization', token).
//                         end(function (error, res) {
//                             if (error) {
//                                 return console.log(error);
//                             }
//                             expect(res).to.have.status(403);
//                             res.body.err.should.be.equal('You are not an admin to do that OR You are not signed in');
//                             done();
//                         });
//                 });

//             });
//     });
//      // --- Mockgoose Termination --- //
//      after(function (done) {
//         mongoose.connection.close(function () {
//             done();
//         });
//     });
//     // --- End of "Mockgoose Termination" --- //
// });
