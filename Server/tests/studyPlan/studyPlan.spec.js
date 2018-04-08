var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
chai.use(chaiHttp);


describe('/GEt publishedStudyPlans', function () {
    it(
        'should list ALL publishedStudyPlans on /getPublishedStudyPlans',
        function (done) {
            chai.request(server).get('/getPublishedStudyPlans').
                end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();

                    if (err) {
                        console.log(err);
                    }

                });

        }
    );
});
