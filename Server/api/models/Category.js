var mongoose = require('mongoose');
var sectionSchema = mongoose.Schema({
    iconLink: {
        required: true,
        trim: true,
        type: String
    },
    name: {
        required: true,
        trim: true,
        type: String
    }
});

var categorySchema = mongoose.Schema({
    iconLink: {
        required: true,
        trim: true,
        type: String
    },
    name: {
        required: true,
        trim: true,
        type: String,
        unique: true
    },
    sections: { type: [sectionSchema] }
});

var Category = mongoose.model('Category', categorySchema, 'categories');
