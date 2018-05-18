/*eslint-disable*/

import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../activity.service';
import { Activity, ActivityCreate, ActivityEdit } from '../activity';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivityEditComponent } from '../activity-edit/activity-edit.component';
import { DiscussionService } from '../../discussion.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import * as tf from '@tensorflow/tfjs';
import load = gapi.load;
import {async} from 'rxjs/scheduler/async';


@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent implements OnInit {
  /*
    @author: Wessam
  */
  // comments: any[];
  changingComment: any = '';
  somePlaceholder: any = 'write a comment ...';
  viewedReplies: boolean[];
  isReplying: boolean;
  commentReplyingOn: any;
  signedIn: boolean;
  toggle: String;
  canBookFor: String[];
  BookFor: string[];
  bookingUser: String;
  defaultPP: String = 'assets/images/profile-view/defaultPP.png';
  // var tf = require('@tensorflow/tfjs');
  classifier: any = tf.sequential();
  Words: any = [];
  datasetmain: any = [];

isEmpty = false;
  currentUser = {
    isAdmin: false,
    verified: false,
    avatar: null,
    username: 'Mohamed Maher',
    isChild: false,
    booked: false
  };
  // updatedActivity: ActivityCreate;
  isCreator = false;
  isBooked = true;


  username = '';

  public updatedActivity: ActivityEdit = {
    name: '',
    description: null,
    bookedBy: null,
    price: null,

    fromDateTime: null,
    toDateTime: null,

    image: null,
    creator: null,
  };

  activity: Activity = {
    _id: '',
    name: '',
    description: '',
    bookedBy: [''], // userIds
    price: 0,
    creator: '',
    status: '',
    fromDateTime: null,
    toDateTime: null,
    createdAt: null,
    updatedAt: null,
    image: '',
    discussion: []
  };

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    public dialog: MatDialog,
    private discussionService: DiscussionService,
    private router: Router,
    private authService: AuthService,
    public translate: TranslateService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    let self = this;
    self.BookFor = [''];
    self.getCurrentUser();
    self.getActivity();
    self.refreshComments(true);

    this.translate.get('ACTIVITIES.DETAIL.WRITE_COMMENT').subscribe((res: string) => {
      this.somePlaceholder = res;
    });
    this.translate.onLangChange.subscribe((event: any) => {
      this.translate.get('ACTIVITIES.DETAIL.WRITE_COMMENT').subscribe((res: string) => {
        this.somePlaceholder = res;
      });
    });

  }

  getCurrentUser() {
    let self = this;
    this.authService.getUserData([
      'username',
      'isAdmin',
      'firstName',
      'lastName',
      'avatar',
      'children',
      'isChild'
    ]).subscribe(function (res) {
      if (typeof res.data === 'undefined') {
        self.signedIn = false;
      } else {
        self.currentUser = res.data;
        self.signedIn = true;
        self.canBookFor = res.data.children;

        let id = self.route.snapshot.paramMap.get('id');
        self.activityService.getActivity(id).subscribe(function(resp) {
          if ( resp.data.bookedBy.includes(self.currentUser.username)) {
  self.currentUser.booked = true;

          }
          self.BookFor = resp.data.bookedBy;
        for (let x of self.BookFor ) {
if ( self.canBookFor.includes(x)) {
           self.canBookFor.splice(self.canBookFor.indexOf(x), 1);
}
if (self.canBookFor.length === 0) {
  self.isEmpty = true; }

      }});
    }}
    );

  }

  redirectToProfile(username: String) {
    console.log('directToProfile');
    // this.router.navigate(['/Profile/' + username]);
    // TODO: Redirect the Profile of the username.
    // AUTHOR: Maher.
  }

  onReply(id: any): any {
    let self = this;
    let element = document.getElementById('target');
    element.scrollIntoView();
    let input = document.getElementById('inputArea');
    self.somePlaceholder = 'leave a reply';
    input.focus();
    this.isReplying = true;
    this.commentReplyingOn = id;
  }

  onDelete(i: any) {
    let self = this;
    this.discussionService.deleteCommentOnActivity(this.activity._id, i).subscribe(function (err) {
      self.refreshComments(false);
    });
  }

  onDeleteReply(commentId: any, replyId: any) {
    let self = this;
    this.discussionService.deleteReplyOnCommentOnActivity(this.activity._id, commentId, replyId).subscribe(function (err) {
      self.refreshComments(false);
    });
  }


  getActivity() {
    /*
      Getting the activities from the api

      @var event: An object that gets fired by mat-paginator

      @author: Wessam
    */
    let id = this.route.snapshot.paramMap.get('id');
    let self = this;
    this.activityService.getActivity(id).subscribe(
      res => {
        this.activity = res.data;
        this.activity.discussion = this.activity.discussion.reverse();
        for (let i = 0 ; i < this.activity.discussion.length; i++) {
          this.activity.discussion[i].replies = this.activity.discussion[i].replies.reverse();
        }
        this.updatedActivity = res.data;
        if (this.activity.bookedBy.length < 1) { self.isBooked = false; }
        if (this.activity.creator === self.currentUser.username) { self.isCreator = true; }
        if (!this.activity.image) {
          this.activity.image = 'assets/images/activity-view/lam3y.png';
        }
      }
    );

  }

  refreshComments(refreshViewReplies: boolean): any {

    this.getActivity();
    if (refreshViewReplies) {
      this.viewedReplies = [];
      for (let i = 0; i < this.activity.discussion.length; i++) {
        this.viewedReplies.push(false);
      }
    }


  }


  showReply(i: number) {
    this.viewedReplies[i] = !this.viewedReplies[i];
  }

  addComment() {

    if (!this.changingComment || 0 === this.changingComment.length || !this.changingComment.trim()) {
      return;
    }
    if (this.isReplying) {
      let self = this;
      this.discussionService.postReplyOnCommentOnActivity(
        this.activity._id,
        this.commentReplyingOn,
        self.changingComment).subscribe(function (err) {
          if (err.msg !== 'reply created successfully') {
            self.refreshComments(false);
          }
          self.refreshComments(false);
          self.changingComment = '';
        });
    } else {
      let self = this;
      this.discussionService.postCommentOnActivity(this.activity._id, self.changingComment).subscribe(function (err) {
        if (err.msg === 'reply created successfully') {
        }
        self.refreshComments(false);
        self.changingComment = '';
      });
    }

  }



  cancelReplying() {
    this.isReplying = false;
    this.somePlaceholder = 'write a comment ...';
  }



  openDialog(): void { // author: Heidi
    let from = new Date(this.activity.fromDateTime).toJSON();
    let to = new Date(this.activity.toDateTime).toJSON();
    let dialogRef = this.dialog.open(ActivityEditComponent, {
      width: '700px',
      height: '520px',
      hasBackdrop: true,
      data: {
        name: this.activity.name, price: this.activity.price,
        description: this.activity.description,
        fromDateTime: from.substr(0, from.length - 1)
        , toDateTime: to.substr(0, to.length - 1)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updatedActivity.name = result.name;
      this.updatedActivity.price = result.price;
      this.updatedActivity.description = result.description;
      this.updatedActivity.fromDateTime = new Date(result.fromDateTime).getTime();
      this.updatedActivity.toDateTime = new Date(result.toDateTime).getTime();
     // taking new values from dialog , assigning them to updatedActivity
     // and passing it to EditActivity method
       this.EditActivity(this.updatedActivity);
    });
  }


  EditActivity(activity) {
    let id = this.route.snapshot.paramMap.get('id');
    this.activityService.EditActivity(this.updatedActivity, id).subscribe(
      res => {
      }

    );
  }

  uploaded(url: string) {
    let self = this;
    let id = this.route.snapshot.paramMap.get('id');
    if (url === 'imageFailedToUpload') {
      self.translate.get('ACTIVITIES.TOASTER.TOASTER_FAIL').subscribe(
        function(translation) {
          self.toastrService.error(translation);
        }
      );
    } else if (url === 'noFileToUpload') {
      self.translate.get('ACTIVITIES.TOASTER.TOASTER_SELECT').subscribe(
        function(translation) {
          self.toastrService.error(translation);
        });

    } else {
      let upload = {
        image: url
      };
      this.activityService.EditActivityImage(upload, id).subscribe((res) => {
        if (res.data) {
          self.translate.get('ACTIVITIES.TOASTER.TOASTER_SUCCESS').subscribe(
            function(translation) {
              self.toastrService.success(translation);
            });
          this.activity.image = res.data;
        } else {
          self.translate.get('ACTIVITIES.TOASTER.TOASTER_FAIL').subscribe(
            function(translation) {
              self.toastrService.error(translation);
            });
        }
      });
    }
    document.getElementById('closeModal').click();
    document.focus();

  }

  deleteActivity() {
    this.activityService.deleteActivity(this.activity).subscribe();
    this.router.navigate([`activities`]);

  }

  bookActivity(user) {
    let self = this;
    this.authService.getUserData(['username']).subscribe(function (resp) {
      this.bookingUser = resp.data.username;

      self.activityService.bookActivity(self.activity, {username: user}).subscribe(
        res => {
          self.isBooked = true;
          if (user === resp.data.username) {
            self.currentUser.booked = true;
          }


          if (self.canBookFor.includes(user)) {
            let index = self.canBookFor.indexOf(user);
            self.canBookFor.splice(index, 1);
            self.bookingUser = null;


          }
          if (self.canBookFor.length === 0) {
            self.isEmpty = true;
          }
          self.translate.get('ACTIVITIES.DETAIL.BOOK_SUCCESS').subscribe((res: string) => {
            self.toastrService.success(res);
          });
        }
      );
    });
  }

  train() {

    let self = this;
    $.get('assets/datasetWords.txt', async function(data) {
      self.datasetmain = [];
      let lines = data.split('\n');
      // var batchSize = 10
      let totalDatasetLength = lines.length - (lines.length % 10);
      console.log('loading the dictionary and the dataset...');
      for (let i = 0; i < lines.length; i = i + 1) {
        // read each line of text
        let line = lines[i].split(' ');
        let w = line[0];
        let t = line[1];
        let l = line[2];
        self.datasetmain.push({
          word: w,
          id: i,
          title: t,
          label: l
        });
      }

      let datasetWords = [];

      for (let i = 0; i < self.datasetmain.length ; i++) {
        datasetWords.push(self.datasetmain[i].word);
      }

      self.Words = datasetWords.filter(function(elem, index, selff) {
        return index === selff.indexOf(elem);
      });

      self.classifier.add(tf.layers.dense({
        units: 100,
        inputDim: (self.Words.length * 3) + 1,
        activation: 'relu',
        kernelInitializer: 'glorotUniform'
      }));
      self.classifier.add(tf.layers.dense({
        units: 100,
        activation: 'relu',
        kernelInitializer: 'glorotUniform'
      }));
      self.classifier.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid',
        kernelInitializer: 'glorotUniform'
      }));

      self.classifier.compile({
        optimizer: 'Adam',
        loss: 'meanSquaredError',
        metrics: ['accuracy']
      });


      let dataset = self.datasetmain.slice(0, 10000);

      for (let k = 0; k < dataset.length; k = k + 50) {
        let  X_train_tensor;
        let Y_train_tensor;
        let out = (tf.tidy(() => {
          let batch = dataset.slice(k, k + 50);

          X_train_tensor = (tf.tidy(() => {
            let X       = tf.oneHot(tf.tensor1d([self.Words.indexOf(batch[0].word)], 'int32'), self.Words.length).as1D();
            let curr_X_ = tf.zeros([self.Words.length]);
            let curr_X_2 = tf.zeros([self.Words.length]);
            return tf.concat([curr_X_2, curr_X_, X, tf.tensor1d([batch[0].title], 'float32')], 0).flatten().as2D(1, X.shape[0] + curr_X_2.shape[0] + curr_X_.shape[0] + 1);
          }));

          Y_train_tensor = tf.tensor1d([batch[0].label[0]], 'float32').as2D(1, 1);

          // making the X_train
          for (let i = 1; i < batch.length; i++) {
            // console.log(tf.memory().numTensors + ' tensors in memory');

            X_train_tensor = (tf.tidy(() => {
              const curr_X_tensor = tf.oneHot(tf.tensor1d([self.Words.indexOf(batch[i].word)], 'int32'), self.Words.length).as1D();
              let curr_X_             = tf.oneHot(tf.tensor1d([(self.Words.indexOf(batch[i - 1].word))], 'int32'), self.Words.length).as1D();
              let curr_X_2;
              if (i - 2 > -1 && self.Words.indexOf(batch[ i - 2 ].word) !== -1) {
                curr_X_2              = tf.oneHot(tf.tensor1d([(self.Words.indexOf(batch[i - 2].word))], 'int32'), self.Words.length).as1D();
              } else {
                curr_X_2 = tf.zeros([self.Words.length]);
              }
              let curr_x = tf.concat([curr_X_2, curr_X_, curr_X_tensor, tf.tensor1d([batch[i].title], 'float32')], 0).flatten();
              return tf.concat([X_train_tensor, curr_x.as2D(1, curr_x.shape[0])], 0);
            }));


            // console.log(tf.memory().numTensors + ' tensors in memory');
            Y_train_tensor =  (tf.tidy(() => {
              let curr_y = tf.tensor1d([batch[i].label[0]], 'float32');
              return tf.concat([Y_train_tensor, curr_y.as2D(1, curr_y.shape[0])], 0);
            }));

          }
          // console.log(X_train_tensor.shape);

          return {x: X_train_tensor, y: Y_train_tensor};
        }));
        console.log('fitting batch number ' + k + ' from ' + dataset.length + ' with ' + tf.memory().numTensors + ' tensors in memory');
        console.log(out.x.shape);
        let history = await self.classifier.fit( out.x, out.y, {batchSize: 20, epochs: 10 });

      }
      //
      console.log('Dictionary loaded Successfully with ' + tf.memory().numTensors + ' tensor in memory');

      console.log('the Classifier is ready');

    }, 'text');

  }


  predict(testset, id) {

    let self = this;
    let batchSize = 30;

    let testsetWords = [];

    for (let i = 0; i < testset.length ; i++) {
      testsetWords.push(testset[i].word);
    }

    let batch = testset.slice(0, batchSize);

    let X_test_tenso  = tf.oneHot(tf.tensor1d([self.Words.indexOf(batch[0].word)], 'int32'), self.Words.length).as1D();
    let curr_X_test   = tf.zeros([self.Words.length]);
    let curr_X_test2   = tf.zeros([self.Words.length]);
    let X_test_tensor = tf.concat([curr_X_test2, curr_X_test, X_test_tenso, tf.tensor1d([batch[0].title], 'float32')], 0).flatten().as2D(1, X_test_tenso.shape[0] + curr_X_test2.shape[0] + curr_X_test.shape[0] + 1);

    // FOR TESTING let Y_test_tensor = tf.tensor1d([batch[0].label[0]], 'float32').as2D(1,1);

    // making the X_test
    console.log('loading TestSet ... ' + 0);
    for (let i = 1; i < batch.length; i++) {
      let id = self.Words.indexOf(batch[i].word); let title = batch[i].title; let label = batch[i].label;
      let curr_X_;

      X_test_tensor = (tf.tidy(() => {
        const curr_X_tensor = tf.oneHot(tf.tensor1d([id], 'int32'), self.Words.length).as1D();
        curr_X_             = tf.oneHot(tf.tensor1d([(self.Words.indexOf(batch[ i - 1 ].word))], 'int32'), self.Words.length).as1D();
        let curr_X_2;
        if (i - 2 > -1 && self.Words.indexOf(batch[ i - 2 ].word) !== -1) {
          curr_X_2            = tf.oneHot(tf.tensor1d([(self.Words.indexOf(batch[ i - 2 ].word))], 'int32'), self.Words.length).as1D();
        } else {
          curr_X_2 = tf.zeros([self.Words.length]);
        }
        let curr_x          = tf.concat([curr_X_2, curr_X_, curr_X_tensor, tf.tensor1d([title], 'float32')], 0).flatten();
        return tf.concat([X_test_tensor, curr_x.as2D(1, curr_x.shape[0])], 0);
      }));


      // FOR TESTING Y_test_tensor = (tf.tidy(() => {
      //   let curr_y = tf.tensor1d([batch[i].label], 'float32');
      //   return tf.concat([Y_test_tensor, curr_y.as2D(1,curr_y.shape[0])], 0);
      // }));
    }
    let p = self.classifier.predict(X_test_tensor);
    p.data().
    then(function(value) {
      // console.log(value);
      // addToPred({ word : batch[value.indexOf(value.slice().sort()[0])], confidence: value.slice().sort()[0] }, testset, batchSize, id);
      console.log(batch[value.indexOf(value.slice().sort()[0])]);
    });

    for (let f = batchSize; f < testset.length; f = f + batchSize) {
      tf.tidy(() => {
        let batch = testset.slice(f, f + batchSize );

        let X_test_tensor = tf.tidy(() => {
          let X_test_tensor = tf.oneHot(tf.tensor1d([self.Words.indexOf(batch[0].word)], 'int32'), self.Words.length).as1D();
          let curr_X_test   = tf.zeros([self.Words.length]);
          let curr_X_test2   = tf.zeros([self.Words.length]);
          return tf.concat([curr_X_test2, curr_X_test, X_test_tensor, tf.tensor1d([batch[0].title], 'float32')], 0).flatten().as2D(1, X_test_tensor.shape[0] + curr_X_test2.shape[0] + curr_X_test.shape[0] +1);
        });

        // FOR TESTING let Y_test_tensor = tf.tensor1d([batch[0].label[0]], 'float32').as2D(1,1);

        // making the X_test
        console.log('loading TestSet ... ' + f);
        for (let i = 1; i < batch.length; i++) {

          let id = self.Words.indexOf(batch[i].word); let title = batch[i].title; let label = batch[i].label;
          let curr_X_;

          X_test_tensor = (tf.tidy(() => {
            const curr_X_tensor = tf.oneHot(tf.tensor1d([id], 'int32'), self.Words.length).as1D();
            curr_X_             = tf.oneHot(tf.tensor1d([(self.Words.indexOf(batch[ i - 1 ].word))], 'int32'), self.Words.length).as1D();
            let curr_X_2;
            if (i - 2 > -1 && self.Words.indexOf(batch[ i - 2 ].word) !== -1) {
              curr_X_2          = tf.oneHot(tf.tensor1d([(self.Words.indexOf(batch[ i - 2 ].word))], 'int32'), self.Words.length).as1D();
            } else {
              curr_X_2 = tf.zeros([self.Words.length]);
            }
            let curr_x          = tf.concat([curr_X_2, curr_X_, curr_X_tensor, tf.tensor1d([title], 'float32')], 0).flatten();
            return tf.concat([X_test_tensor, curr_x.as2D(1, curr_x.shape[0])], 0);
          }));

          // FOR TESTING Y_test_tensor = (tf.tidy(() => {
          //   let curr_y =  tf.tensor1d([batch[i].label], 'float32');
          //   return tf.concat([Y_test_tensor, curr_y.as2D(1,1)], 0);
          // }));

        }
        let p = self.classifier.predict(X_test_tensor);

        p.data().
        then(function(value) {
          // console.log(value);
          // console.log(batch[value.indexOf(value.slice().sort()[0])]);
          // addToPred({ word : batch[value.indexOf(value.slice().sort()[0])], confidence: value.slice().sort()[0] }, testset, batchSize, id);
          console.log(batch[value.indexOf(value.slice().sort()[0])]);
        });


        // FOR TESTING var equality = tf.equal(tf.round(p), Y_test_tensor);
        // var accuracy = tf.mean(equality);
        // console.log('The Accuracy of batch ' + f + ' is :');
        // accuracy.print();
      });
      console.log('predicting batch number ' + f + ' from ' + testset.length);

    }
  }


  getUncommon(sentence, common) {
    let wordArr = sentence.match(/\w+/g),
      commonObj = {},
      uncommonArr = [],
      word, i;

    common = common.split(',');
    for ( i = 0; i < common.length; i++ ) {
      commonObj[ common[i].trim() ] = true;
    }

    for ( i = 0; i < wordArr.length; i++ ) {
      word = wordArr[i].trim().toLowerCase();
      if ( !commonObj[word] ) {
        uncommonArr.push(word);
      }
    }

    return uncommonArr;
  }

  autoGenerateTags(title, body) {

    let common = 'the, be, to, of, and, a, in, that, have,' +
      ' I, it, for, not, on, with, he, as, you, do, at, th' +
      'is, but, his, by, from, they, we, say, her, she, or' +
      ', an, will, my, one, all, would, there, their, what' +
      ', so, up, out, if, about, who, get, which, go, me, ' +
      'when, make, can, like, time, no, just, him, know, t' +
      'ake, people, into, year, your, good, some, could, t' +
      'hem, see, other, than, then, now, look, only, come,' +
      ' its, over, think, also, back, after, use, two, how' +
      ', our, work, first, well, way, even, new, want, bec' +
      'ause, any, these, give, day, most, us, is, are, then,' +
      ' they, it, am, many, more, much, and, i';
    let titleWords = title.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, ' ');

    let titleList = this.getUncommon(titleWords, common).
    map(function (keyword) {
      return {
        title: 1,
        word: keyword
      };
    });

    let bodyWords = body.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, ' ');

    let bodyList = this.getUncommon(bodyWords, common).
    map(function (keyword) {
      return {
        title: 0,
        word: keyword
      };
    });

    let wordList = titleList.concat(bodyList);

    if (body === 'ok') {
      let jsonClassifier = JSON.stringify(this.classifier);
      let newClassifier = JSON.parse(jsonClassifier.toString());
      this.classifier = newClassifier;
    } else {

      this.predict(wordList, 0);

    }


  }


}
