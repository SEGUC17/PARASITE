import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import { ScheduleService } from './schedule.service';
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
  selector: 'app-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  view: 'month';
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  // schedule: Schedule;
  activeDayIsOpen: Boolean = true;
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

  modalData: {
    action: string;
    event: CalendarEvent;
  };


  // TODO: To be obtained from server in viewPersonalSchedule by Dalia
  refresh: Subject<any> = new Subject();
  schedule: CalendarEvent[];

  constructor(private scheduleService: ScheduleService) { }
  // FIXME: Temporary Constant
  thisUser = {
    children: [],
    isParent: true,
    isTeacher: false,
    isAdmin: false,
    username: 'realGuy',
  };



  ngOnInit() {
    this.fetchEvents();
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

  createEvent(title: string, start: Date, end: Date, targetUser: String) {
    // FIXME: To be modified for obtaining logged in user's data and profile owner's username
    if (this.thisUser.isParent) {
      const newEvent = {
        title: title,
        start: start,
        end: end
      };
      const indexChild = this.thisUser.children.indexOf(targetUser);
      if ((targetUser === this.thisUser.username) || (this.thisUser.isParent && indexChild !== -1)) {
        this.schedule.push(newEvent);
      }
    }
    this.refresh.next();
  }

  editEvent(oldEvent: CalendarEvent, title: string, start: Date, end: Date, targetUser: String) {
    // FIXME: To be modified for obtaining logged in user's data and profile owner's username
    if (this.thisUser.isParent) {
      const newEvent = {
        title: title,
        start: start,
        end: end
      };
      const indexChild = this.thisUser.children.indexOf(targetUser);
      const index = this.schedule.indexOf(oldEvent);
      if (index === -1) {
        return; // Error: Event not found
      }
      if ((targetUser === this.thisUser.username) || (this.thisUser.isParent && indexChild !== -1)) {
        this.schedule.splice(index, 1);
        this.createEvent(title, start, end, targetUser);
      }
    }
    this.refresh.next();
  }

  deleteEvent(event: CalendarEvent, targetUser: String) {
    // FIXME: To be modified for obtaining logged in user's data and profile owner's username
    if (this.thisUser.isParent) {
      const indexChild = this.thisUser.children.indexOf(targetUser);
      const index = this.schedule.indexOf(event);
      if (index === -1) {
        return;
      }
      // Error: Event not found
      if ((targetUser === this.thisUser.username) || (this.thisUser.isParent && indexChild !== -1)) {
        this.schedule.splice(index, 1);
      }
    }
    this.refresh.next();
  }

  saveScheduleChanges(targetUser: String) {
    // FIXME: To be modified for obtaining logged in user's data and profile owner's username
    // TODO: To be implemented in backend
    const indexChild = this.thisUser.children.indexOf(targetUser);
    if ((targetUser === this.thisUser.username) || (this.thisUser.isParent && indexChild !== -1)) {
      this.scheduleService.saveScheduleChanges(targetUser, this.schedule);
    }
    this.refresh.next();
  }



}
