import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { StudyPlan } from './study-plan';
import { StudyPlanService } from './study-plan.service';
import { Subject } from 'rxjs/Subject';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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
  styleUrls: ['./study-plan.component.css']
})
export class StudyPlanComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  type: String;
  _id: String;
  username: String;
  studyPlan: StudyPlan;
  view = 'month';
  viewDate: Date = new Date();
  events: CalendarEvent[];
  description: SafeHtml;
  activeDayIsOpen: Boolean = true;
  refresh: Subject<any> = new Subject();
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

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private studyPlanService: StudyPlanService) {
    this.studyPlan = {
      _id: '',
      creator: '',
      description: '',
      events: [],
      title: ''
    };
    this.events = [];
    this.route.params.subscribe(params => {
      this.type = params.type;
      this._id = params.id;
    });
  }

  ngOnInit() {
    if (this.type === 'personal') {
      this.studyPlanService.getPersonalStudyPlan(this.username, this._id)
        .subscribe(res => {
          this.studyPlan = res.data;
          this.events = this.studyPlan.events;
          this.description = this.sanitizer.bypassSecurityTrustHtml(this.studyPlan.description);
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
          this.description = this.sanitizer.bypassSecurityTrustHtml(this.studyPlan.description);
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

    this.events = [
      {
        start: subDays(startOfDay(new Date()), 1),
        end: addDays(new Date(), 1),
        title: 'A 3 day event',
        color: colors.red,
        actions: this.actions
      },
      {
        start: startOfDay(new Date()),
        title: 'An event with no end date',
        color: colors.yellow,
        actions: this.actions
      },
      {
        start: subDays(endOfMonth(new Date()), 3),
        end: addDays(endOfMonth(new Date()), 3),
        title: 'A long event that spans 2 months',
        color: colors.blue
      },
      {
        start: addHours(startOfDay(new Date()), 2),
        end: new Date(),
        title: 'A draggable and resizable event',
        color: colors.yellow,
        actions: this.actions,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        draggable: true
      }
    ];
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
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }

  publish(): void {
    this.studyPlanService.PublishStudyPlan(this.studyPlan);
    alert('Implement Publish Study Plan!');
  }

  copy(): void {
    alert('Implement Copy Study Plan!');
  }

  assign(): void {
    alert('Implement Assign Study Plan!');
  }

  edit(): void {
    alert('Implement Edit Study Plan!');
  }

}
