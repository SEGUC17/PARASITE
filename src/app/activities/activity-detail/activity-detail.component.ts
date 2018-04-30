import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ActivityService } from '../activity.service';
import { Activity, ActivityCreate, ActivityEdit } from '../activity';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivityEditComponent } from '../activity-edit/activity-edit.component';
import { DiscussionService } from '../../discussion.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

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
  comment: any = 'comment';
  viewedReplies: boolean[];
  isReplying: boolean ;
  commentReplyingOn: any;
  signedIn: boolean ;
  canBookFor: String[];
  bookingUser: String;
  defaultPP: String = "assets/images/profile-view/defaultPP.png";


  currentUser = {
    isAdmin: false,
    verified: false,
    avatar: null,
    username: 'Mohamed Maher',
    isChild: true

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
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    let self = this;
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
    this.authService.getUserData(['username']).subscribe(function (res) {
      this.username = res.data.username;
      console.log('booked? ' + self.isBooked);
      console.log('creator? ' + self.isCreator);
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
    ]).subscribe(function(res) {
        if (typeof res.data === 'undefined') {
          self.signedIn = false;
        } else {
          self.currentUser = res.data;
          self.signedIn = true;
          self.canBookFor = res.data.children;
          self.canBookFor.push(res.data.username);
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
    let input = document.getElementById('inputArea');
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
        self.canBookFor =
          self.canBookFor.filter(user => res.data.bookedBy.indexOf(user) < 0);
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
    this.somePlaceholder = 'write a comment ...';
  }



  openDialog(): void {
    let from = new Date(this.activity.fromDateTime).toJSON();
    let to   = new Date(this.activity.toDateTime).toJSON();
  let   dialogRef = this.dialog.open(ActivityEditComponent, {
    width: '700px',
    height: '520px',
    hasBackdrop: false,
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
  }


  uploaded(url: string) {
    if (url === 'imageFailedToUpload') {
      console.log('image upload failed');
      // TODO: handle image uploading failure
    } else {
      console.log('in vcC and its uploaded with url = ' + url);
      // TODO: handle image uploading success and use the url to retrieve the image later
    }
  }

  deleteActivity() {
    this.activityService.deleteActivity(this.activity).subscribe();
  }

  bookActivity() {
    this.activityService.bookActivity(this.activity, {username: this.bookingUser}).subscribe();
  }



}
