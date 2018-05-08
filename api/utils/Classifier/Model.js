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
      var totalDatasetLength = lines.length - (lines.length%10);

      console.log('loading the dictionary and the dataset...');
      for (var i = 0; i < lines.length; i = i + 1) {
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


      let datasetWords = [];

      for(var i =0; i < dataset.length ; i++) {
        datasetWords.push(dataset[i].word);
      }

      var Words = datasetWords.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      });

      var classifier = tf.sequential();

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
        optimizer: tf.train.sgd(0.15),
        loss: 'meanSquaredError',
        metrics: ['accuracy']
      });


      dataset = dataset.slice(0,200);

      for(let k = 0; k< dataset.length; k= k+50) {
        // (tf.tidy(() => {

          let batch = dataset.slice(k,k+50);


          let  X_train_tensor = tf.oneHot(tf.tensor1d([Words.indexOf(batch[0].word)], 'int32'), Words.length).as1D();
          let curr_X_ = tf.zeros([Words.length]);
          X_train_tensor = tf.concat([curr_X_, X_train_tensor,tf.tensor1d([batch[0].title], 'float32')], 0).flatten().as2D(1,X_train_tensor.shape[0] + curr_X_.shape[0] +1);

          let Y_train_tensor = tf.tensor1d([batch[0].label[0]], 'float32').as2D(1,1);

          // making the X_train
          for (let i = 1; i < batch.length; i++) {
            let curr_x = (tf.tidy(() => {
              const curr_X_tensor = tf.oneHot(tf.tensor1d([Words.indexOf(batch[i].word)], 'int32'), Words.length).as1D();
              curr_X_             = tf.oneHot(tf.tensor1d([Words.indexOf(batch[i-1].word)], 'int32'), Words.length).as1D();
              return tf.concat([curr_X_,curr_X_tensor,tf.tensor1d([batch[i].title], 'float32')], 0).flatten();
            }));
            X_train_tensor = tf.concat([X_train_tensor, curr_x.as2D(1,curr_x.shape[0])], 0);
            let curr_y = (tf.tidy(() => {
              return tf.tensor1d([batch[i].label[0]], 'float32');
            }));
            Y_train_tensor = tf.concat([Y_train_tensor, curr_y.as2D(1,curr_y.shape[0])], 0);
          }

          console.log('fitting batch number ' + k + ' from ' + dataset.length);
          classifier.fit( X_train_tensor, Y_train_tensor, {batchSize: 50, epochs: 10 });

        // }));

      }
      //
      console.log('Dictionary loaded Successfully')

      let predictions = [];
      let Y_test   = [];

      var testset = dataset.slice(0, 50);

      var testsetWords = [];

      for(var i =0; i < testset.length ; i++) {
        testsetWords.push(testset[i].word);
      }

      // Testing set //////////////////////////////////////
      for(let f = 0; f< testset.length; f= f+10) {
        tf.tidy(() => {
        let batch = testset.slice(f,f+10);

        let X_test_tensor = tf.oneHot(tf.tensor1d([Words.indexOf(batch[0].word)], 'int32'), Words.length).as1D();
        let curr_X_test   = tf.zeros([Words.length]);
        X_test_tensor     = tf.concat([curr_X_test,X_test_tensor,tf.tensor1d([batch[0].title], 'float32')], 0).flatten().as2D(1,X_test_tensor.shape[0] + curr_X_test.shape[0] +1);

        let Y_test_tensor = tf.tensor1d([batch[0].label[0]], 'float32').as2D(1,1);

        // making the X_test
        console.log('loading TestSet ... ' + testset.length);
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
          if(predictions == []) { predictions = p.as2D(1,p.shape[0]); } else {
            predictions = tf.concat([predictions, p], 0)  ;
          }
          if(Y_test == []) { Y_test = Y_test_tensor.as2D(1,Y_test_tensor.shape[0]); } else {
            Y_test = tf.concat([Y_test, Y_test_tensor], 0);
          }
          console.log('inside of Tidy ' + tf.memory().numTensors);

        });
        console.log('predicting batch number ' + f + ' from ' + testset.length);

      }
      console.log('Testset Loaded Successfully !!');
      console.log('final ' + tf.memory().numTensors);

      ///////////////////////////////////////////////////////

      console.log(predictions);

      // let prediction = predictions[0].as2D(1,predictions[0].shape[0]);
      // let Y = Y_train[0].as2D(1,Y_train[0].shape[0]);
      //
      // for(let g =  0 ; g < predictions.length; g++)
      // {
      //   prediction = prediction.concat([prediction, predictions[g]],0);
      // }
      //
      // for(let g =  0 ; g < predictions.length; g++)
      // {
      //   Y = Y.concat([Y, Y_train[g]],0);
      // }
      predictions.print();

      var equality = tf.equal(tf.round(predictions), Y_train);
      var accuracy = tf.mean(equality);
      console.log('The Accuracy is');
      accuracy.print();

    });
    return 0;
  }
