/*eslint-disable*/

var mongoose = require('mongoose');
var Word = mongoose.model('Word');
var fs = require('fs')
var tf = require('@tensorflow/tfjs');

module.exports.loadDict = function() {

    fs.readFile(__dirname + '/datasetWords.txt', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var dataset = [];
      var lines = data.split('\n');
      console.log('loading the dictionary and the dataset...');
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
        // console.log(i);
        // Word.create({word: w, id: i, title: t, label: l}, function (err, activity) {
        //   if (err) {
        //     // console.log('error Loading a word to the dictionary');
        //   }
        // });

      }

      console.log('Dictionary loaded Successfully')

      var testset = dataset.slice(0);
      dataset = dataset.slice(0, 1000);
      testset = testset.slice(1000, 1300);

      var testsetWords = [];

      for(var i =0; i < testset.length ; i++) {
        testsetWords.push(testset[i].word);
      }

      var datasetWords = [];

      for(var i =0; i < dataset.length ; i++) {
        datasetWords.push(dataset[i].word);
      }


      /// training set ///////////////////////////////

      var  X_train_tensor = tf.oneHot(tf.tensor1d([dataset[0].id], 'int32'), dataset.length).as1D();
      var curr_X_ = tf.zeros([dataset.length]);
      X_train_tensor = tf.concat([curr_X_, X_train_tensor,tf.tensor1d([dataset[0].title], 'float32')], 0).flatten().as2D(1,X_train_tensor.shape[0] + curr_X_.shape[0] +1);

        var Y_train_tensor = tf.tensor1d([dataset[0].label[0]], 'float32').as2D(1,1);

        // making the X_train
        console.log('loading DataSet ... ' + dataset.length);
        for (var i = 1; i < dataset.length; i++) {
          var curr_x = (tf.tidy(() => {
            const curr_X_tensor = tf.oneHot(tf.tensor1d([dataset[i].id], 'int32'), dataset.length).as1D();
            curr_X_ = tf.oneHot(tf.tensor1d([dataset[i-1].id], 'int32'), dataset.length).as1D();
            return tf.concat([curr_X_,curr_X_tensor,tf.tensor1d([dataset[i].title], 'float32')], 0).flatten();
          }));
          X_train_tensor = tf.concat([X_train_tensor, curr_x.as2D(1,curr_x.shape[0])], 0);
          var curr_y = (tf.tidy(() => {
            return tf.tensor1d([dataset[i].label[0]], 'float32');
          }));
          Y_train_tensor = tf.concat([Y_train_tensor, curr_y.as2D(1,curr_y.shape[0])], 0);

        }
        console.log('Dataset Loaded Successfully !!');
      /////////////////////////////////////////////////////

      // Testing set //////////////////////////////////////
        var X_test_tensor = tf.oneHot(tf.tensor1d([testset[0].id], 'int32'), dataset.length).as1D();
        curr_X_ = tf.zeros([dataset.length]);
        X_test_tensor = tf.concat([curr_X_,X_test_tensor,tf.tensor1d([testset[0].title], 'float32')], 0).flatten().as2D(1,X_test_tensor.shape[0] + curr_X_.shape[0] +1);

        var Y_test_tensor = tf.tensor1d([testset[0].label[0]], 'float32').as2D(1,1);

        // making the X_test
        console.log('loading TestSet ... ' + testset.length);
        for (var i = 1; i < testset.length; i++) {
          var id = datasetWords.indexOf(testset[i].word); var title = testset[i].title; var label = testset[i].label;
          if( id == -1 ){  } else {  }
          var curr_x = (tf.tidy(() => {
            const curr_X_tensor = tf.oneHot(tf.tensor1d([id], 'int32'), dataset.length).as1D();
            curr_X_ = tf.oneHot(tf.tensor1d([testset[i-1].id], 'int32'), dataset.length).as1D();
            return tf.concat([curr_X_, curr_X_tensor,tf.tensor1d([title], 'float32')], 0).flatten();
          }));
          X_test_tensor = tf.concat([X_test_tensor, curr_x.as2D(1,curr_x.shape[0])], 0);

          var curr_y = (tf.tidy(() => {
            return tf.tensor1d([testset[i].label], 'float32');
          }));
          Y_test_tensor = tf.concat([Y_test_tensor, curr_y.as2D(1,curr_y.shape[0])], 0);

        }
        console.log('Testset Loaded Successfully !!');
      ///////////////////////////////////////////////////////

      var classifier = tf.sequential();

      classifier.add(tf.layers.dense({
        units: 100,
        inputDim: X_train_tensor.shape[1],
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

      classifier.fit( X_train_tensor, Y_train_tensor, {batchSize: 10, epochs: 100 });

      console.log('Classifier Has Been Trained');

      var prediction = classifier.predict(X_test_tensor);

      prediction.print();

      var equality = tf.equal(tf.round(prediction), Y_test_tensor);
      var accuracy = tf.mean(equality);
      console.log('The Accuracy is');
      accuracy.print();



    });
    return 0;
  }
