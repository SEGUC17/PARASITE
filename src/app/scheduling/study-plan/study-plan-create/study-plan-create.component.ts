import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { StudyPlan } from '../study-plan';
import { StudyPlanService } from '../study-plan.service';
import { AuthService } from '../../../auth/auth.service';
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

declare const $: any;

@Component({
  selector: 'app-study-plan-create',
  templateUrl: './study-plan-create.component.html',
  styleUrls: ['./study-plan-create.component.scss']
})
export class StudyPlanCreateComponent implements OnInit {

  // study plan details
  title: string;
  description: string;
  events: CalendarEvent[];

  // current user info
  username: string;

  // editor
  public editorOut;
  public editorContent;
  private editorOptions = {
    placeholder: 'Enter the description for your study plan here.'
  };
  separatorKeysCodes = [ENTER, COMMA, SPACE];

  // Calendar API view control
  view = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen: Boolean = false;
  refresh: Subject<any> = new Subject();

  // datetime picker variables
  createStart = new Date();
  createEnd = new Date();
  editStart = new Date();
  editEnd = new Date();

  // edit modal control
  editIndex = 0;

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private studyPlanService: StudyPlanService,
    private router: Router, private _AuthService: AuthService) { }

  ngOnInit() {

    // datetime pickers
    $('.datetimepicker').bootstrapMaterialDatePicker({
      format: 'dddd DD MMMM YYYY - hh:mm a',
      shortTime: true,
      clearButton: true,
      weekStart: 6
    });

    let self = this;

    $('#createStart').bootstrapMaterialDatePicker().on('beforeChange', function (e, date) {
      if (date) {
        self.createStart = date._d;
        $('#createEnd').bootstrapMaterialDatePicker('setMinDate', date);
      }
    });

    $('#createEnd').bootstrapMaterialDatePicker().on('beforeChange', function (e, date) {
      if (date) {
        self.createEnd = date._d;
        $('#createStart').bootstrapMaterialDatePicker('setMaxDate', date);
      }
    });

    $('#editStart').bootstrapMaterialDatePicker().on('beforeChange', function (e, date) {
      if (date) {
        self.editStart = date._d;
        $('#editEnd').bootstrapMaterialDatePicker('setMinDate', date);
      }
    });

    $('#editEnd').bootstrapMaterialDatePicker().on('beforeChange', function (e, date) {
      if (date) {
        self.editEnd = date._d;
        $('#editStart').bootstrapMaterialDatePicker('setMaxDate', date);
      }
    });

    this.description = '';
    this.editorContent = '';
    this.events = [];

    this._AuthService.getUserData(['username']).subscribe((resUser) => {
      this.username = resUser.data.username;
    });
  }

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

  // new event creation handler
  createEvent(eventTitle: string, eventDescription: string, eventStart: Date, eventEnd: Date) {
    this.events.push({
      title: eventTitle,
      start: eventStart,
      end: eventEnd,
      color: {
        primary: '#2196f3',
        secondary: '#D1E8FF'
      },
      draggable: false,
      meta: {
        description: eventDescription ? eventDescription : ''
      }
    });

    $('#createStart').bootstrapMaterialDatePicker('_onClearClick');
    $('#createEnd').bootstrapMaterialDatePicker('_onClearClick');

    this.refresh.next();
  }

  // clear date pickers in event creation modal on cancellation
  cancelCreate() {
    $('#createStart').bootstrapMaterialDatePicker('_onClearClick');
    $('#createEnd').bootstrapMaterialDatePicker('_onClearClick');
  }

  // set date picker values to the values of the event to be edited
  preEdit(index) {
    $('#editStart').bootstrapMaterialDatePicker('_onClearClick');
    $('#editEnd').bootstrapMaterialDatePicker('_onClearClick');
    $('#editStart').bootstrapMaterialDatePicker('setDate', this.events[index].start);
    $('#editEnd').bootstrapMaterialDatePicker('setDate', this.events[index].end);
  }

  // write updated event data
  editEvent(editTitle, editDescription, editStart, editEnd) {
    this.events[this.editIndex].title = editTitle;
    this.events[this.editIndex].meta.description = editDescription;
    this.events[this.editIndex].start = editStart;
    this.events[this.editIndex].end = editEnd;

    $('#editStart').bootstrapMaterialDatePicker('_onClearClick');
    $('#editEnd').bootstrapMaterialDatePicker('_onClearClick');

    this.refresh.next();
  }

  // delete corresponding event
  delete(index) {
    this.events.splice(index, 1);
  }

  create(): void {
    if (!(this.title && this.description && this.events.length)) {
      alert('A Study Plan needs a title, a description, and at least one event.');
      return;
    }

    let studyPlan = new StudyPlan(
      this.title,
      this.events,
      this.description
    );
    this.studyPlanService.createStudyPlan(studyPlan).subscribe(
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

  // editor chnage handler
  onContentChanged(quill) {
    this.editorOut = this.sanitizer.bypassSecurityTrustHtml(this.editorContent);
    this.description = this.editorContent;
  }

}
