import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminService } from '../admin.service';
import { StudyPlanPublishRequest } from './study-plan-publish-request';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  subDays,
  addDays,
  addHours
} from 'date-fns';
import { MessageService } from '../../messaging/messaging.service';
import { AuthService } from '../../auth/auth.service';
declare const swal: any;
declare const $: any;
@Component({
  selector: 'app-publish-requests',
  templateUrl: './publish-requests.component.html',
  styleUrls: ['./publish-requests.component..scss'],
  encapsulation: ViewEncapsulation.None
})
export class PublishRequestsComponent implements OnInit {
  reqs: [StudyPlanPublishRequest];

  // study plan details
  studyPlan: any;
  title: string;
  description: string;
  events: CalendarEvent[];

  // Calendar API view control
  view = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen: Boolean = false;
  refresh: Subject<any> = new Subject();

  constructor(private adminService: AdminService, private router: Router, private translate: TranslateService,
  private _messageService: MessageService, private _authService: AuthService) { }

  ngOnInit() {
    this.title = '';
    this.description = '';
    this.events = [];
    this.studyPlan = {
      creator: '',
      description: '',
      events: [],
      title: '',
      rating: {
        number: 0,
        sum: 0,
        value: 0
      }
    };
    this.viewStudyPlanPublishReqs();
  }

  viewReq(studyPlan) {
    let self = this;
    self.studyPlan = studyPlan;
    self.title = self.studyPlan.title;
    self.description = self.studyPlan.description;
    self.events = self.studyPlan.events;
    for (let index = 0; index < self.events.length; index++) {
      self.events[index].start = new Date(self.events[index].start);
      self.events[index].end = new Date(self.events[index].end);
    }
  }

  viewStudyPlanPublishReqs(): void {
    let self = this;
    self.adminService.viewStudyPlanPublishReqs().subscribe(function (res) {
      self.reqs = res.data;
      self.studyPlan = self.reqs[0].studyPlan;
      self.title = self.studyPlan.title;
      self.description = self.studyPlan.description;
      self.events = self.studyPlan.events;
      for (let index = 0; index < self.events.length; index++) {
        self.events[index].start = new Date(self.events[index].start);
        self.events[index].end = new Date(self.events[index].end);
      }
    });
  }

  respondStudyPlanPublishReqs(response, id, studyPlan): void {
    console.log(id);
    let self = this;
    self.adminService.respondStudyPlanPublishReqs(response, id, studyPlan._id).subscribe(function (res) {
      self.reqs = res.data;
    });
    self.viewStudyPlanPublishReqs();
    if (response === 'disapproved') {
      self._authService.getUserData(['username']).subscribe(function (res) {
        console.log('res.data.username: ' + res.data.username)
        console.log('studyPlan.creator: ' + studyPlan.creator)

        //not testedddd
      self.showPromptMessage(studyPlan.creator, res.data.username);
      });
    }
  }

  // Calendar API control methods

  // calendar header change handler
  headerChange(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    this.activeDayIsOpen = false;
  }

  // day click handler
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }
  showPromptMessage(creator, sender): any {

    // creator is the content creator
    //sender in the currently logged in admin
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
}

