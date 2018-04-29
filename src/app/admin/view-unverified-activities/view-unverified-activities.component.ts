import { Component, OnInit } from '@angular/core';

import { ActivityService } from '../../activities/activity.service';
import { Activity } from '../../activities/activity';
import { apiUrl } from '../../variables';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-view-unverified-activities',
  templateUrl: './view-unverified-activities.component.html',
  styleUrls: ['./view-unverified-activities.component.scss']
})
export class ViewUnverifiedActivitiesComponent implements OnInit {

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
    this.detailedActivities = [];
    let self = this;
    for (let i = 0; i < this.activities.length; i++) {
      if (this.activities[i].status == 'pending') {
        this.activityService.getActivity(this.activities[i]._id).subscribe(
          res => {
            if (!res.data.image) {
              res.data.image = 'https://res.cloudinary.com/nawwar/image/upload/v1524947811/default-activity-image.jpg';
            }
            this.detailedActivities.push(res.data);
          });
      }
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
    let self  = this;
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

  acceptActivity(i: any): void {
    let activity = this.activities[i];
    activity.status = 'verified';
    console.log(activity);
    this.activityService.reviewActivity(activity).subscribe();
  }

  rejectActivity(i: any): void {
    let activity = this.activities[i];
    activity.status = 'rejected';
    this.activityService.reviewActivity(activity).subscribe();
  }

}
