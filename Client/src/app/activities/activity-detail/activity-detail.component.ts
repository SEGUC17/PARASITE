import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../activity.service';
import { Activity, ActivityCreate, ActivityEdit } from '../activity';
import { ActivatedRoute } from '@angular/router';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ActivityEditComponent} from '../activity-edit/activity-edit.component';
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
 // updatedActivity: ActivityCreate;
isCreator = false ;
isNotBooked = false;
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


  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    public dialog: MatDialog,
    private authService: AuthService ,
  ) { }

  ngOnInit() {
    this.getActivity();
    this.refreshComments(12);

    this.authService.getUserData(['username']).subscribe(function (res) {
      this.username = res.data.username;
// if (this.updatedActivity.creator.equal(this.username)) { this.isCreator = true; }

  });
  // if ( this.updatedActivity.bookedBy.length < 1) {
  // this.isNotBooked = true;
 // }
  }
  onReply(): any {
    let self = this;
    let element = document.getElementById('target');
    element.scrollIntoView();
    let input = document.getElementById('lala');
    self.somePlaceholder = 'leave a reply';
    input.focus();
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
        this.updatedActivity = res.data;
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
