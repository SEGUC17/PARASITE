var mongoose = require('mongoose');
var CalendarEvent = mongoose.model('CalendarEvent'),
    StudyPlan = mongoose.model('StudyPlan'),
    User = mongoose.model('User');


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
                msg: 'Study plans retrieved successfully.'
            });
        }
    );
};

module.exports.PublishStudyPlan = function (req, res, next) {

    // @author: Ola
    //publishing a study plan is creating a new studyPlan in
    //the studyPlan schema as it is for the published plans only
    //so i am creating a new studyPlan with the body of the request
    //which is the studyPlan I want to publish and it returns an
    //error if there is an error else that studyPlan published successfully

    if (req.user.username !== req.params.username) {
        return res.status(401).json({
            data: null,
            err: null,
            msg: 'Unauthorized.'
        });
    }
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(404).json({
                data: null,
                err: null,
                msg: 'User not found.'
            });
        }
        StudyPlan.create(req.body, function () {
            if (err) {
                return next(err);
            }
            res.status(201).json({
                data: null,
                err: null,
                msg: 'StudyPlan published successfully.'
            });
        });
    });
};

module.exports.getPersonalStudyPlan = function (req, res, next) {
    if (req.user.username !== req.params.username &&
        req.user.children.indexOf(req.params.username) < 0) {
        return res.status(401).json({
            data: null,
            err: 'Unauthorized.',
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
                err: 'User not found.',
                msg: null
            });
        }

        var target = user.studyPlans.filter(function (studyPlan) {
            return studyPlan._id.equals(req.params.studyPlanID);
        });

        if (!target.length) {
            return res.status(404).json({
                data: null,
                err: 'Study plan not found.',
                msg: null
            });
        }

        return res.status(200).json({
            data: target[0],
            err: null,
            msg: 'Study plan retrieved successfully.'
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
                err: 'Study plan not found.',
                msg: null
            });
        }

        return res.status(200).json({
            data: studyPlan,
            err: null,
            msg: 'Study plan retrieved successfully.'
        });
    });
};

module.exports.createStudyPlan = function (req, res, next) {
    User.findOneAndUpdate(
        { username: req.params.username },
        { $push: { studyPlans: req.body } },
        function (err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(404).json({
                    data: null,
                    err: 'User not found.',
                    msg: null
                });
            }

            res.status(201).json({
                data: null,
                err: null,
                msg: 'Study plan created succesfully.'
            });
        }
    );
};


module.exports.assignStudyPlan = function (req, res, next) {

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
                    err: 'User not found.',
                    msg: null
                });
            }

            return res.status(200).json({
                data: null,
                err: null,
                msg: 'StudyPlan assigned successfully.'
            });
        }
    );

};

module.exports.unAssignStudyPlan = function (req, res, next) {

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
                    err: 'User not found.',
                    msg: null
                });
            }

            return res.status(200).json({
                data: null,
                err: null,
                msg: 'StudyPlan Unassigned from me.'
            });
        }
    );

};


module.exports.rateStudyPlan = function (req, res, next) {
    StudyPlan.findById(
        req.params.studyPlanID,
        function (err, studyPlan) {
            if (err) {
                return next(err);
            }

            var rating = parseInt(req.params.rating, 10);

            var newRating = {
                number: 1,
                sum: rating,
                value: rating
            };

            if (studyPlan.rating) {
                newRating.number = studyPlan.rating.number + 1;
                newRating.sum = studyPlan.rating.sum +
                    rating;
                newRating.value = newRating.sum / newRating.number;
            }

            StudyPlan.findByIdAndUpdate(
                req.params.studyPlanID, { rating: newRating },
                function (err2) {
                    if (err2) {
                        return next(err2);
                    }
                }
            );

            res.status(201).json({
                data: null,
                err: null,
                msg: 'Study plan rated succesfully.'
            });
        }
    );
};

var findStudyPlan = function (studyPlans, studyPlanID) {
    for (var index = 0; index < studyPlans.length; index += 1) {
        if (studyPlans[index]._id &&
            studyPlans[index]._id.equals(studyPlanID)) {
            return studyPlans[index];
        }
    }

    return null;
};

module.exports.deleteStudyPLan = function (req, res, next) {
    if (req.user.username !== req.params.username) {
        return res.status(401).json({
            data: null,
            err: null,
            msg: 'Unauthorized.'
        });
    }
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(404).json({
                data: null,
                err: null,
                msg: 'User not found.'
            });
        }

        var target = findStudyPlan(user.studyPlans, req.params.studyPlanID);

        if (!target) {
            return res.status(404).json({
                data: null,
                err: null,
                msg: 'Study plan not found.'
            });
        }
        user.studyPlans.remove({ studyPlan: target }, function (msg) {
            if (err) {
                console.log(err);
            }

            return res.status(202).json({
                data: msg,
                err: null,
                msg: 'Study Plan deleted successfully.'
            });
        });

    });

};

module.exports.deletePublishedStudyPLan = function (req, res, next) {
    if (req.user.username !== req.params.username) {
        return res.status(401).json({
            data: null,
            err: null,
            msg: 'Unauthorized.'
        });
    }
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(404).json({
                data: null,
                err: null,
                msg: 'User not found.'
            });
        }

        StudyPlan.remove({ _id: req.params.studyPlanID }, function (msg) {
            if (err) {
                console.log(err);
            }

            return res.status(202).json({
                data: msg,
                err: null,
                msg: 'Study Plan deleted successfully.'
            });
        });
    });
};
module.exports.editPersonalStudyPlan = function (req, res, next) {
    if (req.user.username !== req.params.username &&
        req.user.children.indexOf(req.params.username) < 0) {
        return res.status(401).json({
            data: null,
            err: 'Unauthorized.',
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
                    err: 'User not found.',
                    msg: null
                });
            }

            return res.status(200).json({
                data: null,
                err: null,
                msg: 'Study plan updated successfully.'
            });
        }
    );
};
