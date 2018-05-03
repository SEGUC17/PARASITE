import { Component, OnInit } from '@angular/core';

import { ActivityService } from '../activity.service';
import { Activity } from '../activity';
import { AuthService } from '../../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
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
    username: 'Mohamed Maher'

  };

  constructor(
    private activityService: ActivityService,
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getActivities(1);
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
