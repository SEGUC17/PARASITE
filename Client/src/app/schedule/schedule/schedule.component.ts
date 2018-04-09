import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import { ScheduleService } from './schedule.service';
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


@Component({
  selector: 'app-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  view = 'month';
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  activeDayIsOpen: Boolean = false;
  refresh: Subject<any> = new Subject();
  editing = false;

  // Users
  loggedInUser: any = {};
  @Input() profileUser;
  // Variables currently not in use
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: function ({ event }: { event: CalendarEvent }): void {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: function ({ event }: { event: CalendarEvent }): void {
        this.events = this.events.filter(function (iEvent) {
          return iEvent !== event;
        });
        this.handleEvent('Deleted', event);
      }
    }
  ];

  modalData: {
    action: string;
    event: CalendarEvent;
  };




  constructor(private scheduleService: ScheduleService, private _AuthService: AuthService) { }

  ngOnInit() {
    this._AuthService.getUserData(['username', 'isChild', 'children']).subscribe((user) => {
      this.loggedInUser.username = user.data.username;
      this.loggedInUser.isChild = user.data.isChild;
      this.loggedInUser.children = user.data.children;
      this.fetchAndDisplay();
    });
  }

  fetchAndDisplay() {
    // Retrieving schedule from database and displaying it
    const self = this;
    const indexChild = this.loggedInUser.children.indexOf(this.profileUser);
    if (this.loggedInUser.username === this.profileUser || !(indexChild === -1)) {
      this.scheduleService.getPersonalSchedule(this.profileUser).subscribe(function (res) {
        self.events = res.data;
        for (let index = 0; index < self.events.length; index++) {
          self.events[index].start = new Date(self.events[index].start);
          self.events[index].end = new Date(self.events[index].end);
        }
        self.fetchEvents();
      });
    }
  }


  fetchEvents(): void {
    // Adapting the schedule to the selected view
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
    this.refreshDocument();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    // Displaying events in selected day
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
    // Handling changes made by dragging events in the schedule
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    const self = this;
    this.activeDayIsOpen = false;
    this.refreshDocument();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  addEvent(): void {
    // Add a new event
    const self = this;
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
    this.refreshDocument();
  }

  refreshDocument() {
    // Light refresh to show any changes
    const self = this;
    setTimeout(function () {
      return self.refresh.next();
    }, 0);
  }

  saveScheduleChanges() {
    // Save changes to schedule into database
    const indexChild = this.loggedInUser.children.indexOf(this.profileUser);
    if ((this.profileUser === this.loggedInUser.username) || (!(this.loggedInUser.isChild) && indexChild !== -1)) {
      this.scheduleService.saveScheduleChanges(this.profileUser, this.events).subscribe();
    }
    this.editing = false;
    const self = this;
    this.refreshDocument();
  }

  cancel() {
    // Cancel changes, refresh schedule from database
    this.editing = false;
    const self = this;
    this.fetchAndDisplay();
    this.refreshDocument();
  }



}
