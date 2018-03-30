var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    CalendarEvent = mongoose.model('CalendarEvent'),
    StudyPlan = mongoose.model('StudyPlan');

module.exports.getPerosnalStudyPlans = function (req, res, next) {
    User.findOne({ username: req.username }, function (err, user) {
        if (err)
            return next(err);

        return res.status(200).json({
            data: user.studyPlans,
            err: null,
            msg: 'Study plans retrieved successfully.'
        });
    });
};

module.exports.getPerosnalStudyPlan = function (req, res, next) {
    User.findOne({ username: req.username }, function (err, user) {
        if (err)
            return next(err);

        var target = null;
        for (let studyPlan of user.studyPlans)
            if (req.studyPlanID.equals(studyPlan._id)) {
                target = studyPlan;
                break;
            }
        if (!target)
            return res.status(400).json({
                data: null,
                err: null,
                msg: 'Study plan not found.'
            });

        return res.status(200).json({
            data: target,
            err: null,
            msg: 'Study plan retrieved successfully.'
        });
    });
};

module.exports.getPublishedStudyPlan = function (req, res, next) {
    StudyPlan.findById(req.studyPlanID, function (err, studyPlan) {
        if (err)
            return next(err);

        return res.status(200).json({
            data: studyPlan,
            err: null,
            msg: 'Study plan retrieved successfully.'
        });
    });
};

module.exports.createStudyPlan = function (req, res, next) {
    User.findOneAndUpdate({ username: req.username }, { $push: { 'studyPlans': req.studyPlan } }, function (err, user) {
        if (err)
            return next(err);
            
        res.status(201).json({
            data: user,
            err: null,
            msg: 'Study plan created cuccesfully.'
        });
    });
};