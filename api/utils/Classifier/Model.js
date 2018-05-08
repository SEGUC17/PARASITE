/*eslint-disable*/

var app = require('../../../app');
var config = require('../../config/config');

var mongoose = require('mongoose');
var Word = mongoose.model('Word');
var fs = require('fs')
var tf = require('@tensorflow/tfjs');





var predict = function(Words) {


  testset = Words;
  let batchSize = 50;

  var testsetWords = [];

  for(var i =0; i < testset.length ; i++) {
    testsetWords.push(testset[i].word);
  }

  // Testing set //////////////////////////////////////

  /// Initial testing //////////////////////////////////////////
  let batch = testset.slice(0,batchSize);

  let X_test_tensor = tf.oneHot(tf.tensor1d([Words.indexOf(batch[0].word)], 'int32'), Words.length).as1D();
  let curr_X_test   = tf.zeros([Words.length]);
  X_test_tensor     = tf.concat([curr_X_test,X_test_tensor,tf.tensor1d([batch[0].title], 'float32')], 0).flatten().as2D(1,X_test_tensor.shape[0] + curr_X_test.shape[0] +1);

  let Y_test_tensor = tf.tensor1d([batch[0].label[0]], 'float32').as2D(1,1);

  // making the X_test
  console.log('loading TestSet ... ' + 0);
  for (i = 1; i < batch.length; i++) {
    let id = Words.indexOf(batch[i].word); let title = batch[i].title; let label = batch[i].label;
    let curr_x;
    let curr_X_;
    if( id == -1 ){
      curr_x = (tf.tidy(() => {
        const curr_X_tensor = tf.zeros([Words.length]);
        curr_X_             = tf.zeros([Words.length]);
        return tf.concat([curr_X_, curr_X_tensor,tf.tensor1d([title], 'float32')], 0).flatten();
      }));
    }
    else {
      curr_x = (tf.tidy(() => {
        const curr_X_tensor = tf.oneHot(tf.tensor1d([id], 'int32'), Words.length).as1D();
        curr_X_             = tf.oneHot(tf.tensor1d([(Words.indexOf(batch[i-1].word))], 'int32'), Words.length).as1D();
        return tf.concat([curr_X_, curr_X_tensor,tf.tensor1d([title], 'float32')], 0).flatten();
      }));
    }

    X_test_tensor = tf.concat([X_test_tensor, curr_x.as2D(1,curr_x.shape[0])], 0);

    var curr_y = (tf.tidy(() => {
      return tf.tensor1d([batch[i].label], 'float32');
    }));
    Y_test_tensor = tf.concat([Y_test_tensor, curr_y.as2D(1,curr_y.shape[0])], 0);
  }
  let p = classifier.predict(X_test_tensor);
  predictions = p;
  Y_test = Y_test_tensor;

  ////////////////////////////////////////////////////////
  for(let f = batchSize; f< testset.length; f= f+batchSize) {
    tf.tidy(() => {
      let batch = testset.slice(f,f+batchSize);

      let X_test_tensor = tf.oneHot(tf.tensor1d([Words.indexOf(batch[0].word)], 'int32'), Words.length).as1D();
      let curr_X_test   = tf.zeros([Words.length]);
      X_test_tensor     = tf.concat([curr_X_test,X_test_tensor,tf.tensor1d([batch[0].title], 'float32')], 0).flatten().as2D(1,X_test_tensor.shape[0] + curr_X_test.shape[0] +1);

      let Y_test_tensor = tf.tensor1d([batch[0].label[0]], 'float32').as2D(1,1);

      // making the X_test
      console.log('loading TestSet ... ' + f);
      for (i = 1; i < batch.length; i++) {
        let id = Words.indexOf(batch[i].word); let title = batch[i].title; let label = batch[i].label;
        let curr_x;
        let curr_X_;
        curr_x = (tf.tidy(() => {
          const curr_X_tensor = tf.oneHot(tf.tensor1d([id], 'int32'), Words.length).as1D();
          curr_X_             = tf.oneHot(tf.tensor1d([(Words.indexOf(batch[i-1].word))], 'int32'), Words.length).as1D();
          return tf.concat([curr_X_, curr_X_tensor,tf.tensor1d([title], 'float32')], 0).flatten();
        }));
        X_test_tensor = tf.concat([X_test_tensor, curr_x.as2D(1,curr_x.shape[0])], 0);

        var curr_y = (tf.tidy(() => {
          return tf.tensor1d([batch[i].label], 'float32');
        }));
        Y_test_tensor = tf.concat([Y_test_tensor, curr_y.as2D(1,1)], 0);
      }
      let p = classifier.predict(X_test_tensor);
      // console.log(p.data().Int32Array);

      p.data().then(function(value) {
        console.log(value);
        console.log(batch[value.indexOf(value.slice().sort()[0])]);
        // expected output: Array [1, 2, 3]
      });


      var equality = tf.equal(tf.round(p), Y_test_tensor);
      var accuracy = tf.mean(equality);
      console.log('The Accuracy of batch ' + f + ' is :');
      accuracy.print();
    });
    console.log('predicting batch number ' + f + ' from ' + testset.length);

  }
}


var loadDict = function() {

  var Words = config.WORDS;
  var classifier = config.CLASSIFIER;
  var datasetmain = config.DATASETMAIN;

  fs.readFile(__dirname + '/datasetWords.txt', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    datasetmain = [];
    var lines = data.split('\n');
    // var batchSize = 10
    var totalDatasetLength = lines.length - (lines.length%10);

    console.log('loading the dictionary and the dataset...');
    for (var i = 0; i < lines.length; i = i + 1) {
      // read each line of text
      var line = lines[i].split(' ');
      var w = line[0];
      var t = line[1];
      var l = line[2];
      datasetmain.push({
        word: w,
        id: i,
        title: t,
        label: l
      });
    }

    config.DATASETMAIN = datasetmain;


    let datasetWords = [];

    for(var i =0; i < datasetmain.length ; i++) {
      datasetWords.push(datasetmain[i].word);
    }

    Words = datasetWords.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    });

    config.WORDS = Words;

    classifier.add(tf.layers.dense({
      units: 100,
      inputDim: (Words.length*2)+1,
      activation: 'relu',
      kernelInitializer: 'glorotUniform'
    }));
    classifier.add(tf.layers.dense({
      units: 100,
      activation: 'relu',
      kernelInitializer: 'glorotUniform'
    }));
    classifier.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid',
      kernelInitializer: 'glorotUniform'
    }));

    classifier.compile({
      optimizer: 'Adam',
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    config.CLASSIFIER = classifier;

    let dataset = datasetmain.slice(0,3500);

      for(let k = 0; k< dataset.length; k= k+200) {
        let  X_train_tensor;
        let Y_train_tensor;
        (tf.tidy(() => {
          var classifier = config.CLASSIFIER;
          let batch = dataset.slice(k,k+200);

          X_train_tensor = (tf.tidy(() => {
            let X       = tf.oneHot(tf.tensor1d([Words.indexOf(batch[0].word)], 'int32'), Words.length).as1D();
            let curr_X_ = tf.zeros([Words.length]);
            return tf.concat([curr_X_, X,tf.tensor1d([batch[0].title], 'float32')], 0).flatten().as2D(1,X.shape[0] + curr_X_.shape[0] +1);
          }));

          Y_train_tensor = tf.tensor1d([batch[0].label[0]], 'float32').as2D(1,1);

          // making the X_train
          for (let i = 1; i < batch.length; i++) {
            // console.log(tf.memory().numTensors + ' tensors in memory');

            X_train_tensor = (tf.tidy(() => {
              const curr_X_tensor = tf.oneHot(tf.tensor1d([Words.indexOf(batch[i].word)], 'int32'), Words.length).as1D();
              curr_X_             = tf.oneHot(tf.tensor1d([Words.indexOf(batch[i-1].word)], 'int32'), Words.length).as1D();
              let curr_x = tf.concat([curr_X_,curr_X_tensor,tf.tensor1d([batch[i].title], 'float32')], 0).flatten();
              return tf.concat([X_train_tensor, curr_x.as2D(1,curr_x.shape[0])], 0);
            }));


            // console.log(tf.memory().numTensors + ' tensors in memory');
            Y_train_tensor =  (tf.tidy(() => {
              let curr_y = tf.tensor1d([batch[i].label[0]], 'float32');
              return tf.concat([Y_train_tensor, curr_y.as2D(1,curr_y.shape[0])], 0);
            }));

          }
          // console.log(X_train_tensor.shape);
          console.log('fitting batch number ' + k + ' from ' + dataset.length + ' with ' + tf.memory().numTensors + ' tensors in memory');
          var promise = classifier.fit( X_train_tensor, Y_train_tensor, {batchSize: 20, epochs: 10 });
          config.CLASSIFIER = classifier;
          // X_train_tensor.dispose();
          // Y_train_tensor.dispose();
          promise.catch(function(error) {
            // console.log('error in batch ' + k + error.message);
          });
        }));

      }
      //
      console.log('Dictionary loaded Successfully with ' + tf.memory().numTensors + ' tensor in memory');


      // predict(datasetmain.slice(10000,10800));

      console.log('the Classifier is ready');


  });

  return 0;
};

module.exports.predict = predict;
module.exports.loadDict = loadDict;
