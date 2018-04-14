import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../activity.service';
import { Activity } from '../activity';
import { ActivatedRoute } from '@angular/router';

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


  currentUser = {
    isAdmin: false,
    verified: false,
    AvatarLink: null,
    username: 'Mohamed Maher'

  };
  activity: Activity = {
    _id: '',
    name: '',
    description: '',
    bookedBy: [''], // userIds
    price: 0,
    status: '',
    fromDateTime: null,
    toDateTime: null,
    createdAt: null,
    updatedAt: null,
    image: '',
    discussion: []
  }

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) { }

  ngOnInit() {
    this.getActivity();
    this.refreshComments(true);
  }

  onReply(id:any): any {
    let self = this;
    let element = document.getElementById('target');
    element.scrollIntoView();
    let input = document.getElementById('lala');
    self.somePlaceholder = 'leave a reply';
    input.focus();
    this.isReplying =true;
    this.commentReplyingOn = id;
  }

  onDelete(i: any) {
    var self = this;
    this.activityService.deleteCommentOnActivity(this.activity._id, i).subscribe(function(err) {
      if (err) {
        console.log(err);
      }
      self.refreshComments(false);
    });
  }

  onDeleteReply(commentId: any, replyId: any) {
    var self = this;
    this.activityService.deleteReplyOnCommentOnActivity(this.activity._id, commentId, replyId).subscribe(function (err) {
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
    this.activityService.getActivity(id).subscribe(
      res => {
        this.activity = res.data;
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
      for (var i = 0; i < this.activity.discussion.length; i++) {
        this.viewedReplies.push(false)
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
      this.activityService.postReplyOnCommentOnActivity(
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
      this.activityService.postCommentOnActivity(this.activity._id, self.changingComment).subscribe(function (err) {
        if (err.msg === 'reply created successfully') {
          console.log('err in posting');
        }
        self.refreshComments(false);
        self.changingComment = '';
      });
    }

  }

}
