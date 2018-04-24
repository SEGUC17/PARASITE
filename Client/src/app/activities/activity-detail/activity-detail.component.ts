import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../activity.service';
import { Activity, ActivityCreate, ActivityEdit } from '../activity';
import { ActivatedRoute } from '@angular/router';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ActivityEditComponent} from '../activity-edit/activity-edit.component';
import { DiscussionService } from '../../discussion.service';
import { Router } from '@angular/router';
import {AuthService} from '../../auth/auth.service';


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
  isReplying: boolean ;
  commentReplyingOn: any;
  signedIn: boolean ;



  currentUser = {
    isAdmin: false,
    verified: false,
    avatar: null,
    username: 'Mohamed Maher'

  };
 // updatedActivity: ActivityCreate;
isCreator = false ;
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
    private authService: AuthService
  ) { }

  ngOnInit() {
    let self = this;
    self.getCurrentUser();
    self.getActivity();
    self.refreshComments(true);

    this.authService.getUserData(['username']).subscribe(function (res) {
      this.username = res.data.username;
     // console.log('current: ' + this.currentUser.username );
      console.log('booked? ' + self.isBooked);
      console.log('creator? ' + self.isCreator);
// if (this.updatedActivity.creator.equal(this.username)) { this.isCreator = true; }

  });
  // if ( this.updatedActivity.bookedBy.length < 1) {
  // this.isNotBooked = true;
 // }
  }

  getCurrentUser() {
    let self = this;
    this.authService.getUserData([
      'username',
      'isAdmin',
      'firstName',
      'lastName',
      'avatar'
    ]).subscribe(function(res) {
        if (typeof res.data === 'undefined') {
          self.signedIn = false;
        } else {
          self.currentUser = res.data;
          self.signedIn = true;

        }
        console.log('signed in : ' + self.signedIn );
        console.log(res);
      }
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
    let input = document.getElementById('input');
    self.somePlaceholder = 'leave a reply';
    input.focus();
    this.isReplying = true;
    this.commentReplyingOn = id;
  }

  onDelete(i: any) {
    let self = this;
    this.discussionService.deleteCommentOnActivity(this.activity._id, i).subscribe(function(err) {
      if (err) {
        console.log(err);
      }
      self.refreshComments(false);
    });
  }

  onDeleteReply(commentId: any, replyId: any) {
    let self = this;
    this.discussionService.deleteReplyOnCommentOnActivity(this.activity._id, commentId, replyId).subscribe(function (err) {
      if (err) {
        console.log(err);
      }
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
        this.updatedActivity = res.data;
        if (this.activity.bookedBy.length < 1) { self.isBooked = false; }
      if (this.activity.creator === self.currentUser.username) { self.isCreator = true; }
        if (!this.activity.image) {
          this.activity.image = 'assets/images/activity-view/default-activity-image.jpg';
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
      console.log('you have to write something.');
      return;
    }
    if (this.isReplying) {

      console.log('replying');
      let self = this;
      this.discussionService.postReplyOnCommentOnActivity(
        this.activity._id,
        this.commentReplyingOn,
        self.changingComment).subscribe(function (err) {
        if (err.msg !== 'reply created successfully') {
          console.log('err in posting');
          self.refreshComments(false);
        }
        console.log('no error elhamdulla ');
        self.refreshComments(false);
        self.changingComment = '';
      });
    } else {
      let self = this;
      this.discussionService.postCommentOnActivity(this.activity._id, self.changingComment).subscribe(function (err) {
        if (err.msg === 'reply created successfully') {
          console.log('err in posting');
        }
        self.refreshComments(false);
        self.changingComment = '';
      });
    }

  }

  cancelReplying() {
    this.isReplying = false;
  }



  openDialog(): void {
    let from = new Date(this.activity.fromDateTime).toJSON();
    let to   = new Date(this.activity.toDateTime).toJSON();
  let   dialogRef = this.dialog.open(ActivityEditComponent, {
      width: '350px',
      height: '500px',
      data: { name: this.activity.name, price : this.activity.price  ,
         description: this.activity.description ,
         fromDateTime: from.substr(0, from.length - 1)
         , toDateTime : to.substr(0, to.length - 1)
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updatedActivity.name = result.name;
      this.updatedActivity.price = result.price;
      this.updatedActivity.description = result.description;
      this.updatedActivity.fromDateTime = new Date(result.fromDateTime).getTime();
      this.updatedActivity.toDateTime = new Date(result.toDateTime).getTime();
      console.log('from' + this.updatedActivity.fromDateTime);
      console.log('to' + this.updatedActivity.toDateTime);
       this.EditActivity(this.updatedActivity);
    });
  }



EditActivity(activity) {
  let id = this.route.snapshot.paramMap.get('id');
  this.activityService.EditActivity(this.updatedActivity, id).subscribe(
    res => {
        console.log(res);
    }

  );
}}
