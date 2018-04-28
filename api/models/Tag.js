var mongoose = require('mongoose');
var tagSchema = mongoose.Schema({
    name: {
        lowercase: true,
        trim: true,
        type: String
    }
});
mongoose.model('Tag', tagSchema, 'tags');
