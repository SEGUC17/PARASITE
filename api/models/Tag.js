var mongoose = require('mongoose');
var tagSchema = mongoose.Schema({
    name: {
        lowercase: true,
        trim: true,
        type: String,
        unique: true
    }
});
mongoose.model('Tag', tagSchema, 'tags');
