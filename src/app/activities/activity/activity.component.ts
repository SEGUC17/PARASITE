import { Component, OnInit } from '@angular/core';

import { ActivityService } from '../activity.service';
import { Activity } from '../activity';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  /*
  @author: Wessam
  */
  activities: Activity[] = [];
  detailedActivities: any[] = [];
  numberOfElements: Number;
  pageSize: Number;
  pageIndex: Number;
  canCreate: Boolean;

  createUrl = '/create-activity';
  user = {
    isAdmin: false,
    verified: false,
    AvatarLink: null,
    username: 'Mohamed Maher'

  };

  constructor(
    private activityService: ActivityService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getActivities(null);
  }

  getDetailedActivities() {
    this.detailedActivities = [] ;
    var self = this;
    for (var i = 0 ; i < this.activities.length ; i++) {
      this.activityService.getActivity(this.activities[i]._id).subscribe(
        res => {
          this.detailedActivities.push(res.data);
      })
    }
  }
  

  getActivities(event) {
    /*
      Getting the activities from the api

      @var event: An object that gets fired by mat-paginator

      @author: Wessam
    */
    let page = 1;
    if (event) {
      page = event.pageIndex + 1;
    }
    var self  = this;
    this.activityService.getActivities(page).subscribe(function(res) {
      self.updateLayout(res);
      self.getDetailedActivities();
      }
    );
    this.authService.getUserData(['isAdmin']).subscribe((user) => {
      this.user.isAdmin = user.data.isAdmin;
      this.user.verified = user.data.verified;
      this.canCreate = this.user.isAdmin || this.user.verified;
    });


  }


  updateLayout(res) {

    // Setting new values comming from
    // the response
    //
    // @author: Wessam

    this.activities = res.data.docs;
    this.numberOfElements = res.data.total;
    this.pageSize = res.data.limit;
    this.pageIndex = res.data.pageIndex;
    for (let activity of this.activities) {
      if (!activity.image) {
        activity.image = 'assets/images/activity-view/default-activity-image.jpg';
      }
    }
  }


}
