import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { CalendarComponent } from '../calendar/calendar.component';
import { StudyPlan } from './study-plan';
import { Rating } from './star-rating/rating';
import { StudyPlanService } from './study-plan.service';
import { Subject } from 'rxjs/Subject';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

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

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-study-plan',
  templateUrl: './study-plan.component.html',
  styleUrls: ['./study-plan.component.scss']
})
export class StudyPlanComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  // routing parameters
  type: string;
  _id: String;
  username: String;
  listOfChildren: any[];

  // Users
  loggedInUser: any = {};
  @Input() profileUser;

  // end of routing parameters
  rating = 0;
  starCount = 5;
  starColor = 'primary';
  studyPlan: StudyPlan;
  tempStudyPlan: StudyPlan;
  description: string;
  editorContent: SafeHtml;
  events: CalendarEvent[];

  // assign button binding
  assignFunction;
  assignText;

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private studyPlanService: StudyPlanService,
    private router: Router, private _AuthService: AuthService) { }

  ngOnInit() {
    this.studyPlan = {
      creator: '',
      description: '',
      events: [],
      title: ''
    };
    this.description = '';
    this.editorContent = '';
    this.events = [];
    this._AuthService.getUserData(['username', 'isChild', 'children']).subscribe((user) => {
      this.listOfChildren = user.data.children;
      console.log(user.data.children);
    });
    this.route.params.subscribe(params => {
      this.type = params.type;
      this._id = params.id;
      this.username = params.username;
    });

    if (this.type === 'personal') {
      this.studyPlanService.getPersonalStudyPlan(this.username, this._id)
        .subscribe(res => {
          this.studyPlan = res.data;
          this.events = this.studyPlan.events;
          this.description = this.studyPlan.description;
          this.editorContent = this.sanitizer.bypassSecurityTrustHtml(this.description);
          this.assignFunction = this.studyPlan.assigned ? this.unAssign : this.assign;
          this.assignText = this.studyPlan.assigned ? 'Unassign' : 'Assign';
          for (let index = 0; index < this.events.length; index++) {
            this.events[index].start = new Date(this.events[index].start);
            this.events[index].end = new Date(this.events[index].end);
          }
        });
    } else {
      this.studyPlanService.getPublishedStudyPlan(this._id)
        .subscribe(res => {
          this.studyPlan = res.data;
          this.events = this.studyPlan.events;
          this.description = this.studyPlan.description;
          this.editorContent = this.sanitizer.bypassSecurityTrustHtml(this.description);
          if (this.studyPlan.rating) {
            this.rating = this.studyPlan.rating.value;
          }
          for (let index = 0; index < this.events.length; index++) {
            this.events[index].start = new Date(this.events[index].start);
            this.events[index].end = new Date(this.events[index].end);
          }
        });
    }
  }

  publish(): void {
    /*
     @author: Ola
     Here , I am just calling the PublishStudyPlan method in studyPlanService an dpassing to it the
     studyPlan I want to publish if the response is that studyPlan published i will redirect to
     the published studyPlans else i will return the error message
    */
    this.studyPlan._id = undefined;
    this.studyPlanService.PublishStudyPlan(this.studyPlan).subscribe(
      res => {
        if (res.msg === 'StudyPlan published successfully.') {
          alert(res.msg);
          this.router.navigate(['/published-study-plans']);
        } else {
          alert('An error occured while publishing the study plan, please try again.');
        }
      });
  }

  copy(): void {
    this.tempStudyPlan = this.studyPlan;
    this.tempStudyPlan._id = undefined;
    this.studyPlanService
      .createStudyPlan(this.username, this.tempStudyPlan)
      .subscribe(res => {
        alert(res.msg);
      });
  }

  assign = function () {
    // this.studyPlan.assigned = true;
    if (this.loggedInUser.username === this.profileUser) {
      this.studyPlanService.assignStudyPlan(this.username, this._id).subscribe(
        res => {
          if (res.msg === 'StudyPlan assigned successfully.') {
            alert(res.msg);
            this.assignFunction = this.unAssign;
            this.assignText = 'Unassign';
          } else {
            alert('An error occured while assigning the study plan');
          }
        });
    }

  };

  unAssign = function () {
    // this.studyPlan.assigned = false;
    if (this.loggedInUser.username === this.profileUser) {
      this.studyPlanService.unAssignStudyPlan(this.username, this._id).subscribe(
        res => {
          if (res.msg === 'StudyPlan Unassigned from me.') {
            alert(res.msg);
            this.assignFunction = this.assign;
            this.assignText = 'Assign';
          } else {
            alert('An error occured while Unassigning the study plan from me');
          }
        });
    }
  };

  edit(): void {
    this.router.navigate(['/study-plan-edit/edit/' + this.studyPlan._id + '/' + this.username]);
  }

  createEvent(eventTitle: string, eventDescription: string, start: Date, end: Date) {
    this.events.push({
      title: eventTitle,
      start: start,
      end: end,
      color: {
        primary: '#2196f3',
        secondary: '#FAE3E3'
      },
      draggable: true,
      meta: {
        description: eventDescription
      }
    });

    console.log(start);
    console.log(end);
  }
}
