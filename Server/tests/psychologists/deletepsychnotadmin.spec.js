/* eslint-disable max-len */
/* eslint-disable max-statements */

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var server = require('../../app');
var users = mongoose.model('User');
var Psychologist = mongoose.model('Psychologist');
var expect = require('chai').expect;
var should = chai.should();

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

/* a user for signing in as an admin */
var usr = {
    address: 'somewhere',
    avatar: '',
    birthdate: '1/1/1997',
    children: [],
    educationLevel: '',
    educationSystem: '',
    email: 'mariam@m.com',
    firstName: 'mariam',
    isAdmin: true,
    isChild: false,
    isParent: false,
    isTeacher: false,
    lastName: 'mahran',
    password: '12345678',
    phone: ['01035044431'],
    schedule: [],
    studyPlans: [],
    username: 'marioma',
    verified: true
};
var token = null;

describe('user deletes his info from address book', function () {
    var psycho = null;

    /* preparing Mockooge */
    before(function (done) {
    mockgoose.prepareStorage().then(function () {
        mongoose.connect(config.MONGO_URI, function () {
            done();
        });
    });
    });

    /* Mockgoose is ready */

    /* Clearing Mockgoose */
    beforeEach(function (done) {
    mockgoose.helper.reset().then(function () {
        done();
    });
    });

    /* End of "Clearing Mockgoose" */

    /* sign up  to the system */
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
        Psychologist.create({
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
        }, function (err, req) {
            if (err) {
                console.log(err);
            }
            psycho = req;
        });
        });
        chai.request(server).post('/api/signUp').
            send(usr).
            end(function (err, response) {
                if (err) {
                    console.log(err);
                }
                token = response.body.token;

                /* changing user's type to be an admin */

                response.should.have.status(201);
                done();
            });
        });

    it('information is deleted successfully from address book', function (done) {
        chai.request(server).delete('/api/psychologist/delete/' + psycho._id).
            set('Authorization', token).
            end(function (err, res) {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(200);
                res.body.msg.should.be.equal('Psychologist deleted successfully.');
                done();
            });
    });

    /* Mockgoose Termination */
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });

    /* End of "Mockgoose Termination" */
});

// /* eslint-disable max-len */
// /* eslint-disable max-statements */

// var chai = require('chai');
// var chaiHttp = require('chai-http');
// var mongoose = require('mongoose');
// var server = require('../../app');
// var users = mongoose.model('User');
// var Psychologist = mongoose.model('Psychologist');
// var expect = require('chai').expect;
// var should = chai.should();
// var User = require('../../api/models/User');

// chai.use(chaiHttp);

// var config = require('../../api/config/config');
// var Mockgoose = require('mockgoose').Mockgoose;
// var mockgoose = new Mockgoose(mongoose);

// /* a user for signing in as an admin */
// // var usr = {
// //     address: 'somewhere',
// //     avatar: '',
// //     birthdate: '1/1/1997',
// //     children: [],
// //     educationLevel: '',
// //     educationSystem: '',
// //     email: 'mariam@m.com',
// //     firstName: 'mariam',
// //     isAdmin: true,
// //     isChild: false,
// //     isParent: false,
// //     isTeacher: false,
// //     lastName: 'mahran',
// //     password: '12345678',
// //     phone: ['01035044431'],
// //     schedule: [],
// //     studyPlans: [],
// //     username: 'marioma',
// //     verified: true
// // };
// // var token = null;
// this.usr = {
//     address: 'John Address Sample',
//     birthdate: '1/1/1980',
//     email: 'johndoe@gmail.com',
//     firstName: 'John',
//     isAdmin: true,
//     isEmailVerified: true,
//     isTeacher: true,
//     lastName: 'Doe',
//     password: 'JohnPasSWorD',
//     phone: '123',
//     schedule: [],
//     studyPlans: [],
//     username: 'marioma'
// };

// describe('user deletes his info from address book', function () {
//     var psycho = null;

//     /* preparing Mockooge */
//     before(function (done) {
//     mockgoose.prepareStorage().then(function () {
//         mongoose.connect(config.MONGO_URI, function () {
//             done();
//         });
//     });
//     });

//     /* Mockgoose is ready */

// // --- Clearing Mockgoose --- //
// beforeEach(function (done) {
//     var that = this;
//     this.usr = {
//         address: 'John Address Sample',
//         birthdate: '1/1/1980',
//         email: 'johndoe@gmail.com',
//         firstName: 'John',
//         isAdmin: true,
//         isEmailVerified: true,
//         isTeacher: true,
//         lastName: 'Doe',
//         password: 'JohnPasSWorD',
//         phone: '123',
//         schedule: [],
//         studyPlans: [],
//         username: 'marioma'
//     };

//     this.token = '';
//     mockgoose.helper.reset().then(function () {
//         User.create(that.usr, function (err) {
//             if (err) {
//                 return done(err);
//             }

//             chai.request(server).
//                 post('/api/signIn').
//                 send({
//                     'password': that.usr.password,
//                     'username': that.usr.username
//                 }).
//                 end(function (err2, res) {
//                     if (err2) {
//                         return done(err2);
//                     }

//                     that.token = res.body.token;

//                     return done();
//                 });
//         });
//     });
// });
// // --- End of "Clearing Mockgoose" --- //

//     /* sign up  to the system */
//     //sign up
//     var that = this;
//     users.updateOne(
//         { username: 'marioma' },
//         { $set: { isAdmin: true } }, function (err1) {
//             if (err1) {
//                 return console.log(err1);
//             }
//     beforeEach(function (done) {
//         var usr = {
//             address: 'John Address Sample',
//             birthdate: '1/1/1980',
//             email: 'johndoe@gmail.com',
//             firstName: 'John',
//             isAdmin: true,
//             isEmailVerified: true,
//             isTeacher: true,
//             lastName: 'Doe',
//             password: 'JohnPasSWorD',
//             phone: '123',
//             schedule: [],
//             studyPlans: [],
//             username: 'marioma'
//         };
//         mockgoose.helper.reset().then(function () {
//         Psychologist.create({
//             address: 'here',
//             daysOff:
//                 [
//                     'sat',
//                     'sun'
//                 ],
//             email: 'blah@blah.com',
//             firstName: 'mariam',
//             lastName: 'mahran',
//             phone: '010101',
//             priceRange: 1000
//         }, function (err, req) {
//             if (err) {
//                 console.log(err);
//             }
//             psycho = req;
//         });
//         });
//         chai.request(server).post('/api/signUp').
//             send(usr).
//             end(function (err, response) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 that.token = response.body.token;

//                 /* changing user's type to be an admin */

//                 response.should.have.status(201);
//                 done();
//             });
//         });

//     it('information is deleted successfully from address book', function (done) {
//         chai.request(server).delete('/api/psychologist/delete/' + psycho._id).
//             set('Authorization', that.token).
//             end(function (err, res) {
//                 if (err) {
//                     return console.log(err);
//                 }
//                 res.should.have.status(200);
//                 res.body.msg.should.be.equal('Psychologist deleted successfully.');
//                 done();
//             });
//     });
// }
// );
// // --- Mockgoose Termination --- //
// after(function (done) {
// mongoose.connection.close(function () {
//     done();
// });
// });
// // --- End of "Mockgoose Termination" --- //
// });




