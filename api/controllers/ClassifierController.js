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
  // fs.readFile('../utils/Classifier/datasetWords.txt', 'utf8', function (err,data) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   console.log(data);
  // });

  // var datasetPath = '../utils/Classifier/datasetWords.txt';
  // var file = new File(datasetPath);
  // var i = 0;
  // var dataset = [];
  // file.open("r"); // open file with read access
  // while (!file.eof) {
  //   // read each line of text
  //   var line = file.readln().split(' ');
  //   dataset.push({word: line.get(0), id: i, title: line.get(1), label: line.get(2)});
  //   // Word.create({word: line.get(0), id: i, title: line.get(1), label: line.get(2)}, function (err, activity) {
  //   //   if (err) {
  //   //     console.log('error Loading dictionary to the database');
  //   //   }
  //   // });
  //   i++;
  // }
  // file.close();
  // console.log(dataset.length);

}
