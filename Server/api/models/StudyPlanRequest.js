var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudyPlanreqschema = mongoose.Schema({
    StudyPlanID: {
        type: [
            {
            ref: 'StudyPlan',
            type: Schema.Types.ObjectId
        }
    ]
    },
    creator: {
        type: [
            {
            ref: 'User',
            type: Schema.Types.ObjectId
        }
    ]
    },
    status: {
     default: 'unpublished',
     enum: [
            'published',
            'unpublished'
    ],
        type: String
    }
});

var StudyPlanRequest = mongoose.model(
    'StudyPlanRequest',
    StudyPlanreqschema,
    'StudyPlanRequests'
);
