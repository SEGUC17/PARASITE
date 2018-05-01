import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ActivityService } from '../activity.service';
import { Activity } from '../activity';
import { AuthService } from '../../auth/auth.service';
declare const $: any;

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
  pageIndex = 1;
  canCreate: Boolean;
  totalNumberOfPages: Number;

  createUrl = '/create-activity';
  user = {
    isAdmin: false,
    verified: false,
    AvatarLink: null,
    username: ''

  };

  constructor(
    private activityService: ActivityService,
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getActivities(1);
  }

  getDetailedActivities() {
    this.detailedActivities = [];
    let self = this;
    for (let i = 0; i < this.activities.length; i++) {
      this.activityService.getActivity(this.activities[i]._id).subscribe(
        res => {
          if (!res.data.image) {
            res.data.image = 'https://res.cloudinary.com/nawwar/image/upload/v1524947811/default-activity-image.jpg';
          }
          this.detailedActivities.push(res.data);
        });
    }

  }


  getActivities(pageNum) {
    /*
      Getting the activities from the api

      @author: Wessam
    */
    this.pageIndex = pageNum;
    let self = this;
    this.activityService.getActivities(this.pageIndex).subscribe(
      res => {
        self.updateLayout(res);
        self.getDetailedActivities();
        this.totalNumberOfPages = res.data.pages;
      }
    );
    this.authService.getUserData(['isAdmin', 'verified']).subscribe((user) => {
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
    for (let activity of this.activities) {
      if (!activity.image) {
        activity.image = 'assets/images/activity-view/default-activity-image.jpg';
      }
    }
  }

  getPaginationRange(): any {

    let pageNumbers = [];
    let counter = 1;

    console.log(this.pageIndex);
    if (this.pageIndex < 3) {
      // we are in page 1 or 2
      while (counter < 6 && counter <= this.totalNumberOfPages) {
        pageNumbers.push(counter);
        counter += 1;
      }
    } else {
      // we are in a page greater than 2
      pageNumbers.push(this.pageIndex - 2);
      pageNumbers.push(this.pageIndex - 1);
      pageNumbers.push(this.pageIndex);
      if (this.pageIndex + 1 <= this.totalNumberOfPages) {
        pageNumbers.push(this.pageIndex + 1);
      }
      if (this.pageIndex + 2 <= this.totalNumberOfPages) {
        pageNumbers.push(this.pageIndex + 2);
      }
    }
    return pageNumbers;
  }

  showCreateActivityForm(): void {
    $('#createModal').modal('show');
  }
  closeModal(): void {
    document.getElementById('btn11').click();
  }


}
