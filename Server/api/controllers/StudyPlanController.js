var mongoose = require('mongoose');
var CalendarEvent = mongoose.model('CalendarEvent'),
    StudyPlan = mongoose.model('StudyPlan'),
    User = mongoose.model('User');


module.exports.getPublishedStudyPlans = function (req, res, next) {
    StudyPlan.paginate(
        {},
        {
            limit: 20,
            page: req.params.pageNumber
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
    StudyPlan.create(req.body, function (err) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            err: null,
            msg: 'StudyPlan published successfully.'

        });
    });
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

module.exports.getPerosnalStudyPlan = function (req, res, next) {
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

        return res.status(200).json({
            data: target,
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
                    err: null,
                    msg: 'User not found.'
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

module.exports.rateStudyPlan = function (req, res, next) {
    console.log(req.params.studyPlanID);
    console.log(req.body);
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
