/*eslint max-statements: ["error", 20]*/
var mongoose = require('mongoose');
var StudyPlanPublishRequest = mongoose.model('StudyPlanPublishRequest');
var StudyPlan = mongoose.model('StudyPlan');
var User = mongoose.model('User');
var moment = require('moment');

module.exports.getPublishedStudyPlans = function (req, res, next) {

    //@author: Ola
    //paginate returns the published plans page by page
    StudyPlan.paginate(
        {},
        {
            limit: 20,
            //retreive 20 published plans starting from page 1 till 20
            page: req.params.pageNumber
            //page number to be returned is passed each call
        }, function (err, result) {

            if (err) {
                return next(err);
            }

            return res.status(200).json({
                data: result,
                err: null,
                msg: 'Study plans retrieved successfully'
            });
        }
    );
};

module.exports.publishStudyPlan = function (req, res, next) {

    var publishRequest = new StudyPlanPublishRequest({
        requestType: 'create',
        studyPlan: req.body
    });


    StudyPlanPublishRequest.create(publishRequest, function (err) {
        if (err) {
            return next(err);
        }

        res.status(201).json({
            data: null,
            err: null,
            msg: 'Study plan submitted for admin reviewal'
        });
    });

};

module.exports.getPersonalStudyPlan = function (req, res, next) {
    if (req.user.username !== req.params.username &&
        req.user.children.indexOf(req.params.username) < 0) {
        return res.status(401).json({
            data: null,
            err: 'Unauthorized',
            msg: null
        });
    }

    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(404).json({
                data: null,
                err: 'User not found',
                msg: null
            });
        }

        var target = user.studyPlans.filter(function (studyPlan) {
            return studyPlan._id.equals(req.params.studyPlanID);
        });

        if (!target.length) {
            return res.status(404).json({
                data: null,
                err: 'Study plan not found',
                msg: null
            });
        }

        return res.status(200).json({
            data: target[0],
            err: null,
            msg: 'Study plan retrieved successfully'
        });
    });
};

module.exports.getPublishedStudyPlan = function (req, res, next) {
    StudyPlan.findById(req.params.studyPlanID, function (err, studyPlan) {
        if (err) {
            return next(err);
        }

        if (!studyPlan) {
            return res.status(404).json({
                data: null,
                err: 'Study plan not found',
                msg: null
            });
        }

        return res.status(200).json({
            data: studyPlan,
            err: null,
            msg: 'Study plan retrieved successfully'
        });
    });
};

module.exports.createStudyPlan = function (req, res, next) {
    if (req.user.isChild) {
        res.status(401).json({
            data: null,
            err: null,
            msg: 'Not authorized to create a study plan'
        });
    } else {
        User.findOneAndUpdate(
            { username: req.user.username },
            { $push: { studyPlans: req.body } },
            function (err, user) {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(404).json({
                        data: null,
                        err: 'User not found',
                        msg: null
                    });
                }

                res.status(201).json({
                    data: null,
                    err: null,
                    msg: 'Study plan created succesfully'
                });
            }
        );
    }
};


module.exports.assignStudyPlan = function (req, res, next) {
    if (req.params.username === req.user.username && !req.user.isChild) {
        User.findOneAndUpdate(
            {
                'studyPlans._id': req.params.studyPlanID,
                username: req.params.username
            },
            { $set: { 'studyPlans.$.assigned': true } },
            function (err, user) {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(404).json({
                        data: null,
                        err: 'User not found',
                        msg: null
                    });
                }

                return res.status(200).json({
                    data: null,
                    err: null,
                    msg: 'Study plan assigned successfully'
                });
            }
        );
    } else {
        var indexChild = req.user.children.indexOf(req.params.username);
        if (indexChild >= 0) {
            var newStudyPlan = null;
            for (var index = 0; index < req.user.studyPlans.length;
                index += 1) {
                if (req.user.studyPlans[index]._id.
                    equals(req.params.studyPlanID)) {
                    newStudyPlan = req.user.studyPlans[index];
                }
            }
            if (!newStudyPlan) {
                return res.status(404).json({
                    data: null,
                    err: 'Study plan not found',
                    msg: null
                });
            }
            newStudyPlan.assigned = true;
            newStudyPlan._id = mongoose.Types.ObjectId();
            User.findOneAndUpdate(
                { username: req.params.username },
                { $addToSet: { 'studyPlans': newStudyPlan } },
                function (err, child) {
                    if (err) {
                        return next(err);
                    }
                    if (!child) {
                        return res.status(404).json({
                            data: null,
                            err: 'User not found',
                            msg: null
                        });
                    }

                    var notification = {
                        body: req.user.username + ' assigned you to' +
                            newStudyPlan.title,
                        date: moment().toDate(),
                        itemId: newStudyPlan._id,
                        type: 'study plan'
                    };
                    User.findOneAndUpdate(
                        { username: req.params.username },
                        {
                            $push:
                                { 'notifications': notification }
                        }
                        , { new: true },
                        function (errr, updatedUser) {
                            console.log('add the notification');
                            console.log(updatedUser.notifications);
                            if (errr) {
                                return res.status(402).json({
                                    data: null,
                                    err: 'error occurred during adding ' +
                                        'the notification'
                                });
                            }
                            if (!updatedUser) {
                                return res.status(404).json({
                                    data: null,
                                    err: null,
                                    msg: 'User not found.'
                                });
                            }
                        }
                    );

                    return res.status(200).json({
                        data: null,
                        err: null,
                        msg: 'Study plan assigned successfully'
                    });
                }
            );
        } else {
            return res.status(401).json({
                data: null,
                err: 'Not authorized to assign a study plan to this user',
                msg: null
            });
        }
    }
};

module.exports.unAssignStudyPlan = function (req, res, next) {
    var indexChild = req.user.children.indexOf(req.params.username);
    if (req.params.username === req.user.username && !req.user.isChild) {
        User.findOneAndUpdate(
            {
                'studyPlans._id': req.params.studyPlanID,
                username: req.params.username
            },
            { $set: { 'studyPlans.$.assigned': false } },
            function (err, user) {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(404).json({
                        data: null,
                        err: 'User not found',
                        msg: null
                    });
                }

                return res.status(200).json({
                    data: null,
                    err: null,
                    msg: 'Study plan unassigned successfully'
                });
            }
        );
    } else if (indexChild >= 0) {
        User.findOneAndUpdate(
            { username: req.params.username },
            { $pull: { studyPlans: { _id: req.params.studyPlanID } } },
            function (err, user) {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(404).json({
                        data: null,
                        err: 'User not found',
                        msg: null
                    });
                }
                // Start of notification
                var notification = {
                    body: req.user.username + ' unassigned' +
                        'you from a Study Plan',
                    date: moment().toDate(),
                    itemId: req.params.studyPlanID,
                    type: 'study plan'
                };
                User.findOneAndUpdate(
                    { username: req.params.username },
                    {
                        $push:
                            { 'notifications': notification }
                    }
                    , { new: true },
                    function (errr, updatedUser) {
                        console.log('add the notification');
                        console.log(updatedUser.notifications);
                        if (errr) {
                            return res.status(402).json({
                                data: null,
                                err: 'error occurred during adding ' +
                                    'the notification'
                            });
                        }
                        if (!updatedUser) {
                            return res.status(404).json({
                                data: null,
                                err: null,
                                msg: 'User not found.'
                            });
                        }
                    }
                );

                // End of notification

                return res.status(200).json({
                    data: null,
                    err: null,
                    msg: 'Study plan unassigned successfully'
                });
            }
        );
    } else {
        return res.status(401).json({
            data: null,
            err: 'Unauthorized to unassign study plan from user',
            msg: null
        });
    }
};

module.exports.deleteStudyPlan = function (req, res, next) {

    var indexChild = req.user.children.indexOf(req.params.username);
    if ((req.params.username === req.user.username ||
        indexChild >= 0) && !req.user.isChild) {
        User.findOneAndUpdate(
            { username: req.params.username },
            { $pull: { studyPlans: { _id: req.params.studyPlanID } } },
            function (err, user) {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(404).json({
                        data: null,
                        err: 'User not found',
                        msg: null
                    });
                }

                return res.status(202).json({
                    data: null,
                    err: null,
                    msg: 'Study plan deleted successfully'
                });

            }
        );

    } else {
        return res.status(401).json({
            data: null,
            err: 'Unauthorized to delete study plan',
            msg: null
        });
    }
};

module.exports.deletePublishedStudyPlan = function (req, res, next) {
    StudyPlan.findById(req.params.studyPlanID, function (err, studyPlan) {
        if (err) {
            return next(err);
        }

        if (!studyPlan) {
            return res.status(404).json({
                data: null,
                err: 'Study plan not found',
                msg: null
            });
        }

        if (studyPlan.creator !== req.user.username && !req.user.isAdmin) {
            return res.status(401).json({
                data: null,
                err: 'Unauthorized to delete study plan',
                msg: null
            });
        }

        StudyPlan.remove({ _id: req.params.studyPlanID }, function (error) {
            if (error) {
                return next(error);
            }

            return res.status(202).json({
                data: null,
                err: null,
                msg: 'Study Plan deleted successfully'
            });
        });
    });
};

module.exports.editPersonalStudyPlan = function (req, res, next) {
    if (req.user.username !== req.params.username &&
        req.user.children.indexOf(req.params.username) < 0) {
        return res.status(401).json({
            data: null,
            err: 'Unauthorized',
            msg: null
        });
    }

    User.findOneAndUpdate(
        {
            'studyPlans._id': req.params.studyPlanID,
            username: req.params.username
        },
        {
            $set: {
                'studyPlans.$.description': req.body.description,
                'studyPlans.$.events': req.body.events,
                'studyPlans.$.title': req.body.title
            }
        },
        function (err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(404).json({
                    data: null,
                    err: 'User not found',
                    msg: null
                });
            }

            return res.status(200).json({
                data: null,
                err: null,
                msg: 'Study plan updated successfully'
            });
        }
    );
};

module.exports.editPublishedStudyPlan = function (req, res, next) {
    StudyPlan.findById(req.params.studyPlanID, function (err, studyPlan) {
        if (err) {
            return next(err);
        }

        if (!studyPlan) {
            return res.status(404).json({
                data: null,
                err: 'Study plan not found',
                msg: null
            });
        }

        if (req.user.username !== studyPlan.creator &&
            !req.user.isAdmin) {
            return res.status(401).json({
                data: null,
                err: 'Unauthorized',
                msg: null
            });
        }

        studyPlan.creator = req.user.isAdmin ? studyPlan.creator : req.user;
        studyPlan.description = req.body.description;
        studyPlan.events = req.body.events;
        studyPlan.title = req.body.title;


        var publishRequest = new StudyPlanPublishRequest({
            requestType: 'update',
            studyPlan: studyPlan
        });


        StudyPlanPublishRequest.create(publishRequest, function (error) {
            if (error) {
                return next(error);
            }

            res.status(201).json({
                data: null,
                err: null,
                msg: 'Update submitted for admin reviewal'
            });
        });
    });
};
