var mongoose = require('mongoose');

var userRatingSchema = mongoose.Schema({
    ratedId: {
        required: true,
        trim: true,
        type: mongoose.SchemaTypes.ObjectId
    },
    rating: {
        required: true,
        trim: true,
        type: Number
    },
    type: {
        enum: [
            'content',
            'product',
            'studyPlan'
        ],
        required: true,
        type: String
    },
    username: {
        required: true,
        trim: true,
        type: String
    }
});

var UserRating = mongoose.model('UserRating', userRatingSchema, 'userRatings');
