import { Component, OnInit, ViewEncapsulation} from '@angular/core';

import { ActivityService } from '../../activities/activity.service';
import { Activity } from '../../activities/activity';
import { apiUrl } from '../../variables';
import { AuthService } from '../../auth/auth.service';
import {MessageService} from "../../messaging/messaging.service";
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

declare const swal: any;

@Component({
  selector: 'app-view-unverified-activities',
  templateUrl: './view-unverified-activities.component.html',
  styleUrls: ['./view-unverified-activities.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewUnverifiedActivitiesComponent implements OnInit {

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
    private _messageService: MessageService,
    private translate: TranslateService,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
    this.getActivities(1);
  }


  getActivities(pageNum) {
    /*
      Getting the activities from the api

      @author: Wessam
    */
    let page = pageNum;
    let self  = this;
    this.activityService.getActivities(page).subscribe(function(res) {
        self.updateLayout(res);
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
    for (let activity of this.activities) {
      if (!activity.image) {
        activity.image = 'assets/images/activity-view/default-activity-image.jpg';
      }
    }
  }

  acceptActivity(i: any): void {
    let activity = this.activities[i];
    let self = this;
    activity.status = 'verified';
    console.log(activity);
    this.activityService.reviewActivity(activity).subscribe(
      res => {
        this.getActivities(this.pageIndex);
      }
    );
  }

  rejectActivity(i: any): void {
    let self = this;
    let activity = this.activities[i];
    activity.status = 'rejected';
    this.activityService.reviewActivity(activity).subscribe(function (res) {
      self.showPromptMessage(activity.creator, self.user.username);
      
    });
  }

  showPromptMessage(creator, sender): any {
    // creator is the Activity creator
    // sender in the currently logged in admin
    // isUpdate : false if create
    let self = this;
    swal({
        title: 'Want to send a message to ' + creator + '?',
        text: 'Let ' + creator + ' know what\'s wrong',
        type: 'input',
        showCancelButton: true,
        closeOnConfirm: false,
        animation: 'slide-from-top',
        inputPlaceholder: 'Write reason for disapproval here',
      }, function (inputValue) {
        if (inputValue === false) { return false; }
        if (inputValue === '') {
          swal.showInputError('You need to write something!'); return false;
        }
        let body = 'This is a message from an admin @ Nawwar.\n' + inputValue + '.\nDo not hesitate to contribute with us again.';
        swal('Message sent', 'Message sent is :\n' + body, 'success');
        let msg = { 'body': body, 'recipient': creator, 'sender': sender };
        self._messageService.send(msg).subscribe(function (res2) {

        });
      }
    );
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

}
