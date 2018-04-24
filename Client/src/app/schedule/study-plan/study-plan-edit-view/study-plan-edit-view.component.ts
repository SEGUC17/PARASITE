import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { StudyPlan } from '../study-plan';
import { StudyPlanService } from '../study-plan.service';
import { Subject } from 'rxjs/Subject';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
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
  selector: 'app-study-plan-edit-view',
  templateUrl: './study-plan-edit-view.component.html',
  styleUrls: ['./study-plan-edit-view.component.scss']
})
export class StudyPlanEditViewComponent implements OnInit {
  type: string;
  _id: string;
  username: string;
  studyPlan: StudyPlan;
  title: string;
  events: CalendarEvent[];
  description: string;
  private editor;
  public editorOut;
  public editorContent = ``;
  private editorOptions = {
    placeholder: 'Enter the description for your study plan here.'
  };
  separatorKeysCodes = [ENTER, COMMA, SPACE];

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private studyPlanService: StudyPlanService,
    private router: Router) { }

  ngOnInit() {
    this.studyPlan = {
      creator: '',
      description: '',
      events: [],
      title: ''
    };
    this.events = [];
    this.route.params.subscribe(params => {
      this.type = params.type;
      this.username = params.username;
      this._id = params.id;
    });
    if (this.type === 'edit') {
      if (this.username) {
        this.studyPlanService.getPersonalStudyPlan(this.username, this._id)
          .subscribe(res => {
            this.studyPlan = res.data;
            this.title = this.studyPlan.title;
            this.events = this.studyPlan.events;
            this.description = this.studyPlan.description;
            this.editorContent = this.studyPlan.description;
            for (let index = 0; index < this.events.length; index++) {
              this.events[index].start = new Date(this.events[index].start);
              this.events[index].end = new Date(this.events[index].end);
            }
          });
      } else {
        this.studyPlanService.getPublishedStudyPlan(this._id)
          .subscribe(res => {
            this.studyPlan = res.data;
            this.title = this.studyPlan.title;
            this.events = this.studyPlan.events;
            this.description = this.studyPlan.description;
            this.editorContent = this.studyPlan.description;
            for (let index = 0; index < this.events.length; index++) {
              this.events[index].start = new Date(this.events[index].start);
              this.events[index].end = new Date(this.events[index].end);
            }
          });
      }
    }
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
      meta: {
        description: eventDescription
      }
    });
  }

  create(): void {
    if (!(this.title && this.description && this.events.length)) {
      alert('A Study Plan needs a title, a description, and at least one event.');
      return;
    }
    this.studyPlan.title = this.title;
    this.studyPlan.description = this.description;
    this.studyPlan.events = this.events;
    this.studyPlan.creator = this.username;
    this.studyPlanService.createStudyPlan(this.studyPlan).subscribe(
      res => {
        if (res.err) {
          alert(res.err);
        } else {
          alert(res.msg);
          this.router.navigate(['/profile']);
        }
      }
    );
  }

  saveChanges(): void {
    if (!(this.title && this.description && this.events.length)) {
      alert('A Study Plan needs a title, a description, and at least one event.');
      return;
    }

    this.studyPlanService.editPersonalStudyPlan(this.username, this._id, new StudyPlan(
      this.title,
      this.username,
      this.events,
      this.description
    ))
      .subscribe(res => {
        if (res.err) {
          alert(res.err);
        } else {
          alert(res.msg);
          this.router.navigate(['/profile/' + this.username]);
        }
      });
  }

  onContentChanged(quill) {
    this.editorOut = this.sanitizer.bypassSecurityTrustHtml(this.editorContent);
    this.description = this.editorContent;
  }

}
