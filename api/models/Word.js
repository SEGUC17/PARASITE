var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wordSchema = Schema({

    /*
     *  Word Schema for dictionary
     *
     *   @author: Maher
     */

    id: {
      required: true,
      type: Number,
      unique: true
    },
    label: { type: Number },
    title: { type: Number },
    word: {
      required: true,
      type: String
    }
});

var word = mongoose.model('Word', wordSchema, 'words');


