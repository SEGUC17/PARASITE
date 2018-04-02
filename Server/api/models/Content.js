var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
// TODO: Omit creator specific schema [ProfileDependency | AuthDependency]
var contentSchema = mongoose.Schema({
    approved: {
        required: true,
        type: Boolean
    },
    body: {
        required: true,
        trim: false,
        type: String
    },
    category: {
        required: true,
        trim: true,
        type: String
    },
    creator: {
        trim: true,
        type: String
    },
    creatorAvatarLink: {
        trim: true,
        type: String
    },
    creatorProfileLink: {
        trim: true,
        type: String
    },
    image: {
        trim: false,
        type: String
    },
    section: {
        required: true,
        trim: true,
        type: String
    },
    tags: { type: [String] },
    title: {
        required: true,
        trim: true,
        type: String
    },
    touchDate: {
        default: Date.now,
        type: Date
    },
    type: {
        enum: [
            'resource',
            'idea'
    ],
        type: String
    },
    update: {
        trim: true,
        type: String
    },
    video: {
        trim: true,
        type: String
    }
});
contentSchema.plugin(mongoosePaginate);
var Content = mongoose.model('Content', contentSchema);
