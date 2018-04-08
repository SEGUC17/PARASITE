var chai = require('chai');
var should = chai.should();
var request = require('supertest');
var app = require('../../app');
var adminToken = null;
var authenticatedUser = request.agent(app);
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var config = require('../../api/config/config');
var mockgoose = new Mockgoose(mongoose);
var expect = chai.expect;
var ContentRequest = mongoose.model('ContentRequest');


var adminUser = {
    password: 'salmaadmin',
    username: 'salmaadmin'
};


before(function(done) {
    authenticatedUser.
        post('/api/signIn').
        send(adminUser).
        end(function(err, response) {
            if (!err === null) {
            console.log('sign in err msg is: ' + err);
        }
            response.should.have.status(200);
            adminToken = response.body.token;
            done();
        });
});

describe('Admin view Pending Requests', function() {
it('should get all pending idea contentRequests', function(done) {
    authenticatedUser.
    get('/api/admin/PendingContentRequests/idea').
    set('Authorization', adminToken).
    end(function(err, res) {
        if (!err === null) {
            console.log('get Pending Idea Requests err msg is: ' + err);
        }
        should.exist(res);
        res.should.have.property('body');
        res.should.have.status(200);
        res.body.data.should.be.an('array');
        done();

    });
});
it('should get all pending resource contentRequests', function(done) {
    authenticatedUser.
    get('/api/admin/PendingContentRequests/resource').
    set('Authorization', adminToken).
    end(function(err, res) {
        if (!err === null) {
            console.log('get Pending Resource Requests msg is: ' + err);
        }
        should.exist(res);
        res.should.have.property('body');
        res.should.have.status(200);
        res.body.data.should.be.an('array');
        done();

    });
});
});


describe('Admin respond to Content Requests', function() {
    this.timeout(120000);
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });

    it(
        'status of request should be approved if admin approved',
        function(done) {
            authenticatedUser.
                patch('/api/admin/RespondContentRequest/' +
                '5ac53f899730d28b3cf27c6f').
                send({ str: 'approved' }).
                set('Authorization', adminToken).
                end(function(err, res) {
                    console.log(err);
                    if (!err === null) {
                        console.log('respond to Request err msg is: ' +
                        err);
                    }
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.data.status.should.be.a('string');
                    expect(res.body.data.status).to.equal('approved');
                    done();
                });
            }
        );

        it(
            'status of request should be disapproved if admin dispproved',
            function(done) {
                authenticatedUser.
                    patch('/api/admin/RespondContentRequest/' +
                    '5ac53f899730d28b3cf27c6f').
                    send({ str: 'disapproved' }).
                    set('Authorization', adminToken).
                    end(function(err, res) {
                        console.log(err);
                        if (!err === null) {
                            console.log('respond to Request err msg is: ' +
                            err);
                        }
                        should.exist(res);
                        res.should.have.status(200);
                        res.body.data.status.should.be.a('string');
                        expect(res.body.data.status).to.equal('disapproved');
                        done();
                    });
                }
            );
        it(
            'approved should be true if admin approves',
            function(done) {
                authenticatedUser.
                patch('/api/admin/RespondContentStatus/' +
                '5ac53c299730d28b3cf27c4c').
                send({ str: true }).
                set('Authorization', adminToken).
                end(function(err, res) {
                    if (!err === null) {
                        console.log('respond to content error msg is: ' + err);
                    }
                    console.log(res.body);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.data.approved.should.be.a('boolean');
                    expect(res.body.data.approved).to.equal(true);
                    done();
                });
            }
        );
        it(
            'approved should be false if admin disapproves',
            function(done) {
                authenticatedUser.
                patch('/api/admin/RespondContentStatus/' +
                '5ac53c299730d28b3cf27c4c').
                send({ str: false }).
                set('Authorization', adminToken).
                end(function(err, res) {
                    if (!err === null) {
                        console.log('respond to content error msg is: ' + err);
                    }
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.data.approved.should.be.a('boolean');
                    expect(res.body.data.approved).to.equal(false);
                    done();
                });
            }
        );

    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
});

describe(
    'Admin try to respond with an invalid ContentId / nonexistentID',
    function() {
    this.timeout(120000);
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    it('Non-existent query should display error 404', function(done) {
        authenticatedUser.
        patch('/api/admin/RespondContentStatus/' +
        '5ac53c299730d28b3cf27c12').
        send({ str: false }).
        set('Authorization', adminToken).
        end(function(err, res) {
            if (!err === null) {
                console.log(err);
            }
            should.exist(res);
            res.should.have.property('body');
            res.should.have.status(404);
            res.body.err.should.be.a('string');
            expect(res.body.data).to.equal(null);
            expect(res.body.err).to.equal('Content not found');
            done();
        });
    });
    it('Non-existent query should display error 404', function(done) {
        authenticatedUser.
        patch('/api/admin/RespondContentRequest/' +
        '5ac53c299730d28b3cf27c12').
        send({ str: false }).
        set('Authorization', adminToken).
        end(function(err, res) {
            if (!err === null) {
                console.log(err);
            }
            should.exist(res);
            res.should.have.property('body');
            res.should.have.status(404);
            res.body.err.should.be.a('string');
            expect(res.body.data).to.equal(null);
            expect(res.body.err).to.equal('Request not found');
            done();
        });
    });

    it('Invalid requestId should display error 422', function(done) {
        authenticatedUser.
        patch('/api/admin/RespondContentRequest/' +
        '1').
        send({ str: false }).
        set('Authorization', adminToken).
        end(function(err, res) {
            if (!err === null) {
                console.log(err);
            }
            should.exist(res);
            res.should.have.property('body');
            res.should.have.status(422);
            res.body.err.should.be.a('string');
            expect(res.body.data).to.equal(null);
            expect(res.body.err).to.equal('The Request Id is not valid');
            done();
        });
    });
    it('Invalid contentId should display error 422', function(done) {
        authenticatedUser.
        patch('/api/admin/RespondContentStatus/' +
        '1').
        send({ str: false }).
        set('Authorization', adminToken).
        end(function(err, res) {
            if (!err === null) {
                console.log(err);
            }
            should.exist(res);
            res.should.have.property('body');
            res.should.have.status(422);
            res.body.err.should.be.a('string');
            expect(res.body.data).to.equal(null);
            expect(res.body.err).to.equal('The Content Id is not valid');
            done();
        });
    });

    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });

}
);
