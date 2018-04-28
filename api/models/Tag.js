var mongoose = require('mongoose');
var tagSchema = mongoose.Schema({
    name: {
        trim: true,
        type: String
    },
    subtags: [String]
});
mongoose.model('Tag', tagSchema, 'tags');
