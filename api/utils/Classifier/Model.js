/*eslint-disable*/

var mongoose = require('mongoose');
// var Word = mongoose.model('Word');
var fs = require('fs')
var tf = require('@tensorflow/tfjs');
var async = require('async');

module.exports.loadDict = function() {

    fs.readFile('/home/maher/nawwar/PARASITE/api/utils/Classifier/datasetWords.txt', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var dataset = [];
      var lines = data.split('\n');
      for (var i = 0; i < lines.length; i++) {
        // read each line of text
        var line = lines[i].split(' ');
        var w = line[0];
        var t = line[1];
        var l = line[2];
        dataset.push({
          word: w,
          id: i,
          title: t,
          label: l
        });

      }
      var testset = dataset.slice(0);
      dataset = dataset.slice(0, 300);
      testset = testset.slice(1300, 1400);

      var X_train_tensor = null;
      var Y_train_tensor = null;
      var X_test_tensor = null;
      var Y_test_tensor = null;


      /// training set ///////////////////////////////
        var X_train = [];
        var Y_train = [];
        X_train_tensor = tf.oneHot(tf.tensor1d([dataset[0].id], 'int32'), dataset.length).as1D();
        X_train_tensor = tf.concat([X_train_tensor,tf.tensor1d([dataset[0].title], 'float32')], 0).flatten().as2D(1,X_train_tensor.shape[0]+1);
        X_train.push(X_train_tensor);

        Y_train_tensor = tf.tensor1d([dataset[0].label[0]], 'float32').as2D(1,1);
        Y_train.push(Y_train_tensor);

        // making the X_train
        console.log('loading DataSet ... ' + dataset.length);
        for (var i = 1; i < dataset.length; i++) {
          var curr_x = (tf.tidy(() => {
            const curr_X_tensor = tf.oneHot(tf.tensor1d([dataset[i].id], 'int32'), dataset.length).as1D();
            return tf.concat([curr_X_tensor,tf.tensor1d([dataset[i].title], 'float32')], 0).flatten();
          }));
          // X_train_tensor.print();
          // console.log(X_train_tensor.shape);
          // curr_x.print();
          // console.log(curr_x.shape);
          X_train_tensor = tf.concat([X_train_tensor, curr_x.as2D(1,curr_x.shape[0])], 0);
          var curr_y = (tf.tidy(() => {
            return tf.tensor1d([dataset[i].label[0]], 'float32');
          }));
          Y_train_tensor = tf.concat([Y_train_tensor, curr_y.as2D(1,curr_y.shape[0])], 0);

        }
        // X_train[1].print();
        // console.log(X_train);
        // console.log(Y_train);
        // console.log('Dataset Loaded Successfully !!');
      /////////////////////////////////////////////////////

      // Testing set //////////////////////////////////////
      //   var X_test = [];
      //   var Y_test = [];
      //   X_test_tensor = tf.oneHot(tf.tensor1d([testset[0].id], 'int32'), testset.length).as1D();
      //   X_test_tensor = tf.concat([X_test_tensor,tf.tensor1d([testset[0].title], 'float32')], 0).flatten().as2D(1,X_test_tensor.shape[0]+1);
      //
      //   X_test.push(X_test_tensor);
      //
      //
      //   Y_test_tensor = tf.tensor1d([testset[0].label[0]], 'float32').as2D(1,1);
      //   Y_test.push(Y_test_tensor);
      //
      //   // making the X_test
      //   console.log('loading TestSet ... ' + testset.length);
      //   for (var i = 1; i < testset.length; i++) {
      //     var curr_x = (tf.tidy(() => {
      //       const curr_X_tensor = tf.oneHot(tf.tensor1d([testset[i].id], 'int32'), testset.length).as1D();
      //       return tf.concat([curr_X_tensor,tf.tensor1d([testset[i].title], 'float32')], 0).flatten();
      //     }));
      //     X_test_tensor = tf.concat([X_test_tensor, curr_x.as2D(1,curr_x.shape[0])], 0);
      //     var curr_y = (tf.tidy(() => {
      //       return tf.tensor1d([testset[i].label], 'float32');
      //     }));
      //     Y_test_tensor = tf.concat([Y_test_tensor, curr_y.as2D(1,curr_y.shape[0])], 0);
      //   }
      //   console.log('Testset Loaded Successfully !!');
      ///////////////////////////////////////////////////////



      // without tidy
      // // making the X_train
      // console.log('loading DataSet ...');
      // for (var i = 1; i < dataset.length; i++) {
      //   // adding the oneHot Encoded word and the label
      //   var curr_X_tensor = tf.oneHot(tf.tensor1d([dataset[i].id], 'int32'), dataset.length).as1D();
      //   var curr_Y_tensor = tf.tensor1d([dataset[i].label], 'float32');
      //   // adding label
      //   curr_X_tensor = tf.concat([curr_X_tensor,tf.tensor1d([dataset[i].title], 'float32')], 0).flatten();
      //   // concatenating the tensor to the main tensor
      //   X_train_tensor = tf.concat([X_train_tensor,curr_X_tensor.as2D(1, curr_X_tensor.shape[0])], 0);
      //   Y_train_tensor = tf.concat([Y_train_tensor, curr_Y_tensor], 0);
      // }
      // console.log('Dataset Loaded Successfully !!');

      var classifier = tf.sequential();

        // console.log('X_test_tensor');
        // console.log(X_test_tensor.print());
        // console.log('Y_test_tensor');
        // console.log(Y_test_tensor.print());

      console.log('X_train_tensor.print()');
      console.log(X_train_tensor.print());
      console.log(X_train_tensor.shape);




      classifier.add(tf.layers.dense({
        units: 100,
        inputDim: 11,
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
        optimizer: tf.train.sgd(0.15),
        loss: 'meanSquaredError',
        metrics: ['accuracy']
      });

      console.log('before fitting');

      // classifier.fit( X_train_tensor, Y_train_tensor, {batchSize: 10, epochs: 100 });

      // classifier.predict(X_test_tensor).print();

      console.log('Classifier Has Been Trained');

    });
    return 0;
  }
