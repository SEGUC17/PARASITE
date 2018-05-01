import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-publish-requests',
  templateUrl: './publish-requests.component.html',
  styleUrls: ['./publish-requests.component..scss']
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

  constructor(private adminService: AdminService, private router: Router, private translate: TranslateService) { }

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
    console.log(studyPlan);
    let self = this;
    self.adminService.respondStudyPlanPublishReqs(response, id, studyPlan._id).subscribe(function (res) {
      self.reqs = res.data;
    });
    self.viewStudyPlanPublishReqs();
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

}
