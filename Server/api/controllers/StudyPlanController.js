var mongoose = require('mongoose');
var CalendarEvent = mongoose.model('CalendarEvent'),
    StudyPlan = mongoose.model('StudyPlan'),
    User = mongoose.model('User');


module.exports.getPublishedStudyPlans = function (req, res, next) {
    console.log(req.params.pageNumber);
    console.log(req.params.pageNumber + 1);
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


module.exports.getPerosnalStudyPlans = function (req, res, next) {
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) {
            return next(err);
        }

        return res.status(200).json({
            data: user.studyPlans,
            err: null,
            msg: 'Study plans retrieved successfully.'
        });
    });
};

module.exports.PublishStudyPlan = function (req, res, next) {
    StudyPlan.create(req.body, function (err) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            err: null,
            msg: 'StudyPlan was published successfully.'

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
        console.log('hi');

        if (err) {
            return next(err);
        }

        console.log('bye');

        var target = findStudyPlan(user.studyPlans, req.params.studyPlanID);

        if (!target) {
            return res.status(400).json({
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
        { $push: { 'studyPlans': req.body } },
        function (err) {
            console.log('start');
            console.log(req.params.username);
            console.log(req.body);
            console.log('end');
            if (err) {
                return next(err);
            }

            res.status(201).json({
                data: null,
                err: null,
                msg: 'Study plan created cuccesfully.'
            });
        }
    );
};
