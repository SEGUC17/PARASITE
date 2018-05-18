/*eslint-disable*/
var mongoose = require('mongoose');
// var Word = mongoose.model('Word');
var classifier = require('../utils/Classifier/Model');
fs = require('fs')

var onehot = require('one-hot-enum');


module.exports.test = function (req, res, next) {


};

module.exports.loadDictionary = function() {

 classifier.loadDict();
}
