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
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  type: String;
  _id: String;
  username: String;
  studyPlan: StudyPlan;
  view = 'month';
  viewDate: Date = new Date();
  title: String;
  events: CalendarEvent[];
  description: SafeHtml;
  activeDayIsOpen: Boolean = false;
  refresh: Subject<any> = new Subject();
  private editor;
  public editorOut;
  public editorContent = ``;
  private editorOptions = {
    placeholder: 'Enter the description for your study plan here.'
  };
  separatorKeysCodes = [ENTER, COMMA, SPACE];
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

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
      this.studyPlanService.getPersonalStudyPlan(this.username, this._id)
        .subscribe(res => {
          this.studyPlan = res.data;
          this.title = this.studyPlan.title;
          this.events = this.studyPlan.events;
          this.description = this.studyPlan.description;
          for (let index = 0; index < this.events.length; index++) {
            this.events[index].start = new Date(this.events[index].start);
            this.events[index].end = new Date(this.events[index].end);
          }
        });
    }
  }

  fetchEvents(): void {
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

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
      },
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
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
    this.studyPlanService.createStudyPlan(this.username, this.studyPlan).subscribe(
      res => {
        alert(res.msg);
        this.router.navigate(['/profile']);
      }
    );
  }

  onContentChanged(quill) {
    this.editorOut = this.sanitizer.bypassSecurityTrustHtml(this.editorContent);
    this.description = this.editorContent;
  }

}
