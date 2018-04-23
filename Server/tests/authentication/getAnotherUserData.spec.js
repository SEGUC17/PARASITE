/* eslint max-statements: ["error", 10, { "ignoreTopLevelFunctions": true }] */

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var path = '/api/userData/';
var User = require('../../api/models/User');
// --- End of "Requirements" --- //

// --- Dependancies --- //
var mockgoose = new Mockgoose(mongoose);
var should = chai.should();
// --- End of "Dependancies" --- //

// --- Middleware --- //
chai.use(chaiHttp);
// --- End of "Middleware" --- //

describe('getAnotherUserData', function () {

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });
    // --- End of "Mockgoose Initiation" --- //

    // --- Clearing Mockgoose --- //
    beforeEach(function (done) {
        var that = this;
        this.johnDoe = {
            address: 'John Address Sample',
            birthdate: '1/1/1980',
            email: 'johndoe@gmail.com',
            firstName: 'John',
            isEmailVerified: true,
            isTeacher: true,
            lastName: 'Doe',
            password: 'JohnPasSWorD',
            phone: '123',
            schedule: [],
            studyPlans: [],
            username: 'john'
        };
        this.janeDoe = {
            address: 'Jane Address Sample',
            birthdate: '1/1/2000',
            email: 'janedoe@gmail.com',
            firstName: 'Jane',
            isTeacher: true,
            lastName: 'Doe',
            password: 'JanePasSWorD',
            phone: '123',
            schedule: [],
            studyPlans: [],
            username: 'jane'
        };
        this.token = '';
        this.userDataColumns = [
            'email',
            'firstName',
            'lastName',
            'username'
        ];
        mockgoose.helper.reset().then(function () {
            User.create(that.johnDoe, function (err) {
                if (err) {
                    done(err);
                } else {
                    chai.request(app).
                        post('/api/signIn').
                        send({
                            'password': that.johnDoe.password,
                            'username': that.johnDoe.username
                        }).
                        end(function (err2, res) {
                            if (err2) {
                                done(err2);
                            } else {
                                that.token = res.body.token;
                                User.create(that.janeDoe, function (err3) {
                                    if (err3) {
                                        done(err3);
                                    } else {
                                        done();
                                    }
                                });
                            }
                        });
                }
            });
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    // --- Tests --- //
    it(
        'User Is Not Signed In!'
        , function (done) {
            chai.request(app).
                post(path + this.janeDoe.username).
                send(this.userDataColumns).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(401);
                        res.body.should.have.property('msg').
                            eql('User Is Not Signed In!');
                        done();
                    }
                });
        }
    );
    it(
        'Request "body" Is Empty!',
        function (done) {
            this.userDataColumns = [];
            chai.request(app).
                post(path + this.janeDoe.username).
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(422);
                        res.body.should.have.property('msg').
                            eql('Request Body: Expected non-empty value!');
                        done();
                    }
                });
        }
    );
    it(
        'Request "body" Is Not Valid!',
        function (done) {
            this.userDataColumns = null;
            chai.request(app).
                post(path + this.janeDoe.username).
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(422);
                        res.body.should.have.property('msg').
                            eql('Request Body: Expected array value!');
                        done();
                    }
                });
        }
    );
    it(
        'Request "body" Element(s) Is/Are Not Valid!',
        function (done) {
            this.userDataColumns.push(123);
            chai.request(app).
                post(path + this.janeDoe.email + 'Is Wrong').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(422);
                        res.body.should.have.property('msg').
                            eql('Request Body Element(s): ' +
                                'Expected string value!');
                        done();
                    }
                });
        }
    );
    it(
        'Requested "Email" Is Not In DB!',
        function (done) {
            chai.request(app).
                post(path + this.janeDoe.email + 'Is Wrong').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(404);
                        res.body.should.have.property('msg').
                            eql('User Not Found!');
                        done();
                    }
                });
        }
    );
    it(
        'Requested "Username" Is Not In DB!',
        function (done) {
            chai.request(app).
                post(path + this.janeDoe.username + 'Is Wrong').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(404);
                        res.body.should.have.property('msg').
                            eql('User Not Found!');
                        done();
                    }
                });
        }
    );
    it(
        'Data Retrieval Is Successful (Email)!',
        function (done) {
            var that = this;
            chai.request(app).
                post(path + this.janeDoe.email).
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            res.body.data.should.have.
                                property(that.userDataColumns[index]).
                                eql(that.janeDoe[
                                    that.userDataColumns[index]
                                ]);
                        }
                        done();
                    }
                });
        }
    );
    it(
        'Data Retrieval Is Successful (Email Has Upper Case)!',
        function (done) {
            var that = this;
            chai.request(app).
                post(path + this.janeDoe.email.toUpperCase()).
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            res.body.data.should.have.
                                property(that.userDataColumns[index]).
                                eql(that.janeDoe[
                                    that.userDataColumns[index]
                                ]);
                        }
                        done();
                    }
                });
        }
    );
    it(
        'Data Retrieval Is Successful (Email Has Space)!',
        function (done) {
            var that = this;
            chai.request(app).
                post(path + '  ' + this.janeDoe.email + '  ').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            res.body.data.should.have.
                                property(that.userDataColumns[index]).
                                eql(that.janeDoe[
                                    that.userDataColumns[index]
                                ]);
                        }
                        done();
                    }
                });
        }
    );
    it(
        'Data Retrieval Is Successful (Username)!',
        function (done) {
            var that = this;
            chai.request(app).
                post(path + this.janeDoe.username).
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            res.body.data.should.have.
                                property(that.userDataColumns[index]).
                                eql(that.janeDoe[
                                    that.userDataColumns[index]
                                ]);
                        }
                        done();
                    }
                });
        }
    );
    it(
        'Data Retrieval Is Successful (Username Has Upper Case)!',
        function (done) {
            var that = this;
            chai.request(app).
                post(path + this.janeDoe.username.toUpperCase()).
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            res.body.data.should.have.
                                property(that.userDataColumns[index]).
                                eql(that.janeDoe[
                                    that.userDataColumns[index]
                                ]);
                        }
                        done();
                    }
                });
        }
    );
    it(
        'Data Retrieval Is Successful (Username Has Space)!',
        function (done) {
            var that = this;
            chai.request(app).
                post(path + '  ' + this.janeDoe.username + '  ').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            res.body.data.should.have.
                                property(that.userDataColumns[index]).
                                eql(that.janeDoe[
                                    that.userDataColumns[index]
                                ]);
                        }
                        done();
                    }
                });
        }
    );
    it(
        'Requested Column(s) Is/Are Not Valid!',
        function (done) {
            var that = this;
            this.userDataColumns.push('wrongColumn');
            chai.request(app).
                post(path + '  ' + this.janeDoe.username + '  ').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        res.body.data.should.not.have.property('wrongColumn');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            if (that.userDataColumns[index] !== 'wrongColumn') {
                                res.body.data.should.have.
                                    property(that.userDataColumns[index]).
                                    eql(that.janeDoe[
                                        that.userDataColumns[index]
                                    ]);
                            }
                        }
                        done();
                    }
                });
        }
    );
    it(
        '"password" Attribute Is Requested!',
        function (done) {
            var that = this;
            this.userDataColumns.push('password');
            chai.request(app).
                post(path + '  ' + this.janeDoe.username + '  ').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        res.body.data.should.not.have.property('password');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            if (that.userDataColumns[index] !== 'password') {
                                res.body.data.should.have.
                                    property(that.userDataColumns[index]).
                                    eql(that.janeDoe[
                                        that.userDataColumns[index]
                                    ]);
                            }
                        }
                        done();
                    }
                });
        }
    );
    it(
        '"Non-Admin" Requesting "schedule"!',
        function (done) {
            var that = this;
            this.userDataColumns.push('schedule');
            chai.request(app).
                post(path + '  ' + this.janeDoe.username + '  ').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        res.body.data.should.not.have.property('schedule');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            if (that.userDataColumns[index] !== 'schedule') {
                                res.body.data.should.have.
                                    property(that.userDataColumns[index]).
                                    eql(that.janeDoe[
                                        that.userDataColumns[index]
                                    ]);
                            }
                        }
                        done();
                    }
                });
        }
    );
    it(
        '"Non-Admin" Requesting "studyPlans"!',
        function (done) {
            var that = this;
            this.userDataColumns.push('studyPlans');
            chai.request(app).
                post(path + '  ' + this.janeDoe.username + '  ').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        res.body.data.should.not.have.property('studyPlans');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            if (that.userDataColumns[index] !== 'studyPlans') {
                                res.body.data.should.have.
                                    property(that.userDataColumns[index]).
                                    eql(that.janeDoe[
                                        that.userDataColumns[index]
                                    ]);
                            }
                        }
                        done();
                    }
                });
        }
    );
    it(
        '"Non-Parent" Requesting "schedule"!',
        function (done) {
            var that = this;
            this.userDataColumns.push('schedule');
            chai.request(app).
                post(path + '  ' + this.janeDoe.username + '  ').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        res.body.data.should.not.have.property('schedule');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            if (that.userDataColumns[index] !== 'schedule') {
                                res.body.data.should.have.
                                    property(that.userDataColumns[index]).
                                    eql(that.janeDoe[
                                        that.userDataColumns[index]
                                    ]);
                            }
                        }
                        done();
                    }
                });
        }
    );
    it(
        '"Non-Parent" Requesting "studyPlans"!',
        function (done) {
            var that = this;
            this.userDataColumns.push('studyPlans');
            chai.request(app).
                post(path + '  ' + this.janeDoe.username + '  ').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        res.body.data.should.not.have.property('studyPlans');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            if (that.userDataColumns[index] !== 'studyPlans') {
                                res.body.data.should.have.
                                    property(that.userDataColumns[index]).
                                    eql(that.janeDoe[
                                        that.userDataColumns[index]
                                    ]);
                            }
                        }
                        done();
                    }
                });
        }
    );
    it(
        '"Admin" Requesting "schedule"!',
        function (done) {
            var that = this;
            this.userDataColumns.push('schedule');
            User.updateOne(
                { 'username': this.johnDoe.username },
                { 'isAdmin': true },
                function (err, raw) {
                    if (err) {
                        done(err);
                    } else if (raw) {
                        chai.request(app).
                            post(path + that.janeDoe.username).
                            send(that.userDataColumns).
                            set('Authorization', that.token).
                            end(function (err2, res) {
                                if (err2) {
                                    done(err2);
                                } else {
                                    res.should.have.status(200);
                                    res.body.should.have.property('data');
                                    res.body.data.should.have.
                                        property('schedule');
                                    for (
                                        var index = 0;
                                        index < that.userDataColumns.length;
                                        index += 1
                                    ) {
                                        res.body.data.should.have.
                                            property(that.userDataColumns[
                                                index
                                            ]).
                                            eql(that.janeDoe[
                                                that.userDataColumns[index]
                                            ]);
                                    }
                                    done();
                                }
                            });
                    } else {
                        done(new Error('Raw Was Not Modified!'));
                    }
                }
            );
        }
    );
    it(
        '"Admin" Requesting "studyPlans"!',
        function (done) {
            var that = this;
            this.userDataColumns.push('studyPlans');
            User.updateOne(
                { 'username': this.johnDoe.username },
                { 'isAdmin': true },
                function (err, raw) {
                    if (err) {
                        done(err);
                    } else if (raw) {
                        chai.request(app).
                            post(path + that.janeDoe.username).
                            send(that.userDataColumns).
                            set('Authorization', that.token).
                            end(function (err2, res) {
                                res.should.have.status(200);
                                res.body.should.have.property('data');
                                res.body.data.should.have.
                                    property('studyPlans');
                                for (
                                    var index = 0;
                                    index < that.userDataColumns.length;
                                    index += 1
                                ) {
                                    res.body.data.should.have.
                                        property(that.userDataColumns[index]).
                                        eql(that.janeDoe[
                                            that.userDataColumns[index]
                                        ]);
                                }
                                done();
                            });
                    } else {
                        done(new Error('Raw Was Not Modified!'));
                    }
                }
            );
        }
    );
    it(
        '"Parent" Requesting "schedule"!',
        function (done) {
            var that = this;
            this.userDataColumns.push('schedule');
            User.updateOne({ 'username': this.johnDoe.username }, {
                'children': [this.janeDoe.username],
                'isParent': true
            }, function (err, raw) {
                if (err) {
                    done(err);
                } else if (raw) {
                    User.updateOne(
                        { 'username': that.janeDoe.username },
                        { 'isChild': true },
                        function (err2, raw2) {
                            if (err2) {
                                done(err2);
                            } else if (raw2) {
                                chai.request(app).
                                    post(path + that.janeDoe.username).
                                    send(that.userDataColumns).
                                    set('Authorization', that.token).
                                    end(function (err3, res) {
                                        if (err3) {
                                            done(err3);
                                        } else {
                                            res.should.have.status(200);
                                            res.body.should.have.
                                                property('data');
                                            res.body.data.should.have.
                                                property('schedule');
                                            for (
                                                var index = 0;
                                                index < that.userDataColumns.
                                                    length;
                                                index += 1
                                            ) {
                                                res.body.data.should.have.
                                                    property(that.
                                                        userDataColumns[index]).
                                                    eql(that.janeDoe[
                                                        that.userDataColumns[
                                                        index
                                                        ]
                                                    ]);
                                            }
                                            done();
                                        }
                                    });
                            } else {
                                done(new Error('Raw Was Not Modified!'));
                            }
                        }
                    );
                }
            });
        }
    );
    it(
        '"Parent" Requesting "studyPlans"!',
        function (done) {
            var that = this;
            this.userDataColumns.push('studyPlans');
            User.updateOne({ 'username': this.johnDoe.username }, {
                'children': [this.janeDoe.username],
                'isParent': true
            }, function (err, raw) {
                if (err) {
                    done(err);
                } else if (raw) {
                    User.updateOne(
                        { 'username': that.janeDoe.username },
                        { 'isChild': true },
                        function (err2, raw2) {
                            if (err2) {
                                done(err2);
                            } else if (raw2) {
                                chai.request(app).
                                    post(path + that.janeDoe.username).
                                    send(that.userDataColumns).
                                    set('Authorization', that.token).
                                    end(function (err3, res) {
                                        if (err3) {
                                            done(err3);
                                        } else {
                                            res.should.have.status(200);
                                            res.body.should.have.
                                                property('data');
                                            res.body.data.should.have.
                                                property('studyPlans');
                                            for (
                                                var index = 0;
                                                index < that.userDataColumns.
                                                    length;
                                                index += 1
                                            ) {
                                                res.body.data.should.have.
                                                    property(that.
                                                        userDataColumns[
                                                        index
                                                    ]).
                                                    eql(that.
                                                        janeDoe[
                                                        that.
                                                            userDataColumns[
                                                        index
                                                        ]
                                                    ]);
                                            }
                                            done();
                                        }
                                    });
                            } else {
                                done(new Error('Raw Was Not Modified!'));
                            }
                        }
                    );
                } else {
                    done(new Error('Raw Was Not Modified!'));
                }
            });
        }
    );
    it(
        '"Owner" Requesting "schedule"!',
        function (done) {
            var that = this;
            this.userDataColumns.push('schedule');
            chai.request(app).
                post(path + '  ' + this.johnDoe.username + '  ').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        res.body.data.should.have.property('schedule');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            res.body.data.should.have.
                                property(that.userDataColumns[index]).
                                eql(that.johnDoe[that.userDataColumns[index]]);
                        }
                        done();
                    }
                });
        }
    );
    it(
        '"Owner" Requesting "studyPlans"!',
        function (done) {
            var that = this;
            this.userDataColumns.push('studyPlans');
            chai.request(app).
                post(path + '  ' + this.johnDoe.username + '  ').
                send(this.userDataColumns).
                set('Authorization', this.token).
                end(function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        res.body.data.should.have.property('studyPlans');
                        for (
                            var index = 0;
                            index < that.userDataColumns.length;
                            index += 1
                        ) {
                            res.body.data.should.have.
                                property(that.userDataColumns[index]).
                                eql(that.johnDoe[
                                    that.userDataColumns[index]
                                ]);
                        }
                        done();
                    }
                });
        }
    );
    // --- End of "Tests" --- //

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //

});
