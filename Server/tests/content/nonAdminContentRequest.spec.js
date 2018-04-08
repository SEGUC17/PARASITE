// var chai = require('chai');
// var should = chai.should();
// var request = require('supertest');
// var app = require('../../app');
// var nonAdminToken = null;
// var authenticatedUser = request.agent(app);
// var chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// var mongoose = require('mongoose').Mongoose;
// var Mockgoose = require('mockgoose').Mockgoose;
// var config = require('../../api/config/config');
// var mockgoose = new Mockgoose(mongoose);
// var expect = chai.expect;

// var nonAdminUser = {
//     password: 'salmasalma',
//     username: 'salma'
// };

// before(function(done) {
//     authenticatedUser.
//         post('/api/signIn').
//         send(nonAdminUser).
//         end(function(err, response) {
//             if (!err === null) {
//             console.log('sign in err msg is: ' + err);
//         }
//             response.should.have.status(200);
//            nonAdminToken = response.body.token;
//             done();
//         });
// });

// describe('nonAdmin view Pending Requests', function() {
// it('should get an error and empty response', function(done) {
//     authenticatedUser.
//     get('/api/admin/PendingContentRequests/idea').
//     set('Authorization', nonAdminToken).
//     end(function(err, res) {
//         if (!err === null) {
//             console.log('get Pending Idea Requests err msg is: ' + err);
//         }
//         should.exist(res);
//         res.should.have.property('body');
//         res.should.have.status(403);
//         res.body.err.should.be.a('string');
//         expect(res.body.data).to.equal(null);
//         expect(res.body.err).to.equal('Unauthorized action');
//         done();

//     });
// });
// });


// it('should get an error and empty respons', function(done) {
//     authenticatedUser.
//     get('/api/admin/PendingContentRequests/resource').
//     set('Authorization', nonAdminToken).
//     end(function(err, res) {
//         if (!err === null) {
//             console.log('get Pending Resource Requests msg is: ' + err);
//         }
//         should.exist(res);
//         res.should.have.property('body');
//         res.should.have.status(403);
//         res.body.err.should.be.a('string');
//         expect(res.body.data).to.equal(null);
//         expect(res.body.err).to.equal('Unauthorized action');
//         done();

//     });
// });

// describe('nonAdmin respond to Content Requests', function() {
//     this.timeout(120000);
//     before(function (done) {
//         mockgoose.prepareStorage().then(function () {
//             mongoose.connect(config.MONGO_URI, function () {
//                 done();
//             });
//         });
//     });
//     beforeEach(function (done) {
//         mockgoose.helper.reset().then(function () {
//             done();
//         });
//     });

//     it(
//         'should get an error and empty response',
//         function(done) {
//             authenticatedUser.
//                 patch('/api/admin/RespondContentRequest/' +
//                 '5ac53f899730d28b3cf27c6f').
//                 send({ str: 'approved' }).
//                 set('Authorization', nonAdminToken).
//                 end(function(err, res) {
//                     console.log(err);
//                     if (!err === null) {
//                         console.log('respond to Request err msg is: ' +
//                         err);
//                     }
//                     should.exist(res);
//                     res.should.have.status(403);
//                     res.body.err.should.be.a('string');
//                     expect(res.body.data).to.equal(null);
//                     expect(res.body.err).to.equal('Unauthorized action');
//                     done();
//                 });
//             }
//         );

//         it(
//             'should get an error and empty response',
//             function(done) {
//                 authenticatedUser.
//                     patch('/api/admin/RespondContentRequest/' +
//                     '5ac53f899730d28b3cf27c6f').
//                     send({ str: 'disapproved' }).
//                     set('Authorization', nonAdminToken).
//                     end(function(err, res) {
//                         console.log(err);
//                         if (!err === null) {
//                             console.log('respond to Request err msg is: ' +
//                             err);
//                         }
//                         should.exist(res);
//                         res.should.have.status(403);
//                         res.body.err.should.be.a('string');
//                         expect(res.body.data).to.equal(null);
//                         expect(res.body.err).to.equal('Unauthorized action');
//                         done();
//                     });
//                 }
//             );
//         it(
//             'should get an error and empty response',
//             function(done) {
//                 authenticatedUser.
//                 patch('/api/admin/RespondContentStatus/' +
//                 '5ac53c299730d28b3cf27c4c').
//                 send({ str: true }).
//                 set('Authorization', nonAdminToken).
//                 end(function(err, res) {
//                     if (!err === null) {
//                         console.log('respond to content error msg is: ' + err);
//                     }
//                     console.log(res.body);
//                     should.exist(res);
//                     res.should.have.status(403);
//                     res.body.err.should.be.a('string');
//                     expect(res.body.data).to.equal(null);
//                     expect(res.body.err).to.equal('Unauthorized action');
//                     done();
//             });
//             }
//         );
//         it(
//             'should get an error and empty response',
//             function(done) {
//                 authenticatedUser.
//                 patch('/api/admin/RespondContentStatus/' +
//                 '5ac53c299730d28b3cf27c4c').
//                 send({ str: false }).
//                 set('Authorization', nonAdminToken).
//                 end(function(err, res) {
//                     if (!err === null) {
//                         console.log('respond to content error msg is: ' + err);
//                     }
//                     console.log(res.body);
//                     should.exist(res);
//                     res.should.have.status(403);
//                     res.body.err.should.be.a('string');
//                     expect(res.body.data).to.equal(null);
//                     expect(res.body.err).to.equal('Unauthorized action');
//                     done();
//             });
//             }
//         );

//     after(function (done) {
//         mongoose.connection.close(function () {
//             done();
//         });
//     });
// });
