var mongoose = require('mongoose');

var studyPlanPublishRequestSchema = mongoose.Schema({
    createdOn: {
        default: Date.now,
        type: Date
    },
    requestType: {
        enum: [
            'create',
            'update'
        ],
        required: true,
        type: String
    },
    status: {
        default: 'pending',
        enum: [
            'approved',
            'disapproved',
            'pending'
        ],
        type: String
    },
    studyPlan: {
        required: true,
        type: Object
    },
    updatedOn: {
        default: Date.now,
        type: Date
    }
});

module.exports = mongoose.model(
    'StudyPlanPublishRequest',
    studyPlanPublishRequestSchema,
    'studyPlanPublishRequests'
);
