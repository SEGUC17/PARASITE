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
  comments: any[];
  changingComment: any = '';
  somePlaceholder: any = 'write a comment ...';
  viewedReplies: boolean[];

  currentUser = {
    isAdmin: false,
    verified: false,
    AvatarLink: null,
    username: 'Mohamed Maher'

  };
  activity: Activity;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) { }

  ngOnInit() {
    this.getActivity();
    this.refreshComments(12);
  }

  onReply() {
    this.somePlaceholder = 'write your reply ...';
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


  refreshComments(id: any): any {
    let self = this;
    self.comments = [];
    self.viewedReplies = [];

    const comment1 = {
      creator: 'salma',
      text: 'ana ba7eb sharmoofers aweee',
      replies: [
        {creator: { username: 'MohamedMaher' }, text: 'ya 5aynaaaa, maher bsss' },
        {creator: { username: 'MohamedMaher' }, text: 'ba7eb casey niestattt <3' }
        ]
    };
    const comment2 = {
      creator: 'salma',
      text: 'ana ba7eb sharmoofers aweee',
      replies: []
    };
    const comment3 = {
      creator: 'salma',
      text: 'ana ba7eb sharmoofers aweee',
      replies: [
        {creator: {username: 'MohamedMaher'}, text: '3 maraat kmann, w homa band ya3ny msh ragel wa7ed !!'}
      ]
    };
    self.comments.push(comment1);
    self.viewedReplies.push(false);
    self.comments.push(comment2);
    self.viewedReplies.push(false);
    self.comments.push(comment3);
    self.viewedReplies.push(false);
  }

  showReply(i: number) {
    this.viewedReplies[i] = !this.viewedReplies[i];
  }

  addComment() {
    const comment = {
      creator: 'maher',
      text: this.changingComment
    };
    let self = this;
    self.comments.push(comment);
    this.changingComment = '';


  }

}
