// var chai = require('chai');
// var chaiHttp = require('chai-http');
// var server = require('../../app');
// var should = chai.should();
// var request = require('supertest');
// var assert = chai.assert;

// chai.use(chaiHttp);

// process.env.NODE_ENV = "test";

// const User = {
//     username: 'ahmed1hisham',
//     password: '123456789'
// };

// var token;

// var authenticatedUser = request.agent(server);
// before(function(done){
//     authenticatedUser
//         .post('/api/signIn')
//         .send(User)
//         .end(function(err, response){
//             response.should.have.status(200);
//             token = response.body.token;
//             done();
//         });
// });

// describe('User post a request for contributing validation', function(){

//     it('Post a request for making VCRs ', function(){
//         authenticatedUser
//             .post('/api/profile/VerifiedContributerRequest')
//             .send([])
//             .set( 'Authorization', token )
//             .end(function(err, res){
//                 console.log(res.body);
//                 should.exist(res);
//                 res.should.have.status(200);


//             });
//     });

// })

// describe('Admin View Verified Contributer Requests', function(){


//     it('get request of pending VCRs ', function(done){
//         authenticatedUser
//             .get('/api/admin/VerifiedContributerRequests/pending')
//             .set('Authorization', token )
//             .end(function(err, res){
//                 should.exist(res);
//                 //console.log(res.body)
//                 res.should.have.status(200);
//                 res.should.have.property('body');
//                 res.body.data.should.have.property('dataField');
//                 res.body.data.dataField.should.be.an('array');
//                 done();
//             })
//     });
//     it('get request of accepted VCRs ', function(done){
//         authenticatedUser
//             .get('/api/admin/VerifiedContributerRequests/pending')
//             .set('Authorization', token )
//             .end(function(err, res){
//                 should.exist(res);
//                 //console.log(res.body)
//                 res.should.have.status(200);
//                 res.should.have.property('body');
//                 res.body.data.should.have.property('dataField');
//                 res.body.data.dataField.should.be.an('array');
//                 done();
//             })
//     });
//     it('get request of rejected VCRs ', function(done){
//         authenticatedUser
//             .get('/api/admin/VerifiedContributerRequests/pending')
//             .set('Authorization', token )
//             .end(function(err, res){
//                 should.exist(res);
//                 //console.log(res.body)
//                 res.should.have.status(200);
//                 res.should.have.property('body');
//                 res.body.data.should.have.property('dataField');
//                 res.body.data.dataField.should.be.an('array');
//                 done();
//             })
//     });

// });
