var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudyPlanPublishreqschema = mongoose.Schema({
    createdOn: {
        default: Date.now,
        type: Date
    },
    creator: {
        trim: true,
        type: String
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
    studyPlanID: {
        type: [
            {
                ref: 'StudyPlan',
                type: Schema.Types.ObjectId
            }
        ]
    },
    title: {
        trim: true,
        type: String
    },
    updatedOn: { type: Date }
});

var StudyPlanPublishRequest = mongoose.model(
    'StudyPlanPublishRequest',
    StudyPlanPublishreqschema,
    'studyPlanPublishRequests'
);
