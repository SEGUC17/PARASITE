import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../activity.service';
import { Activity } from '../activity';
import { ActivatedRoute } from '@angular/router';
import { DiscussionService } from '../../discussion.service';

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
  };

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private discussionService: DiscussionService
  ) { }

  ngOnInit() {
    this.getActivity();
    this.refreshComments(true);
    

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
      for (let i = 0; i < this.activity.discussion.length; i++) {
        this.viewedReplies.push(false);
      }
    }
  }

  showReply(i: number) {
    this.viewedReplies[i] = !this.viewedReplies[i];
  }

  enterPressed(event){
    if(event.keyCode == 13) {
      alert('you just clicked enter');
      // rest of your code
    }
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

}
