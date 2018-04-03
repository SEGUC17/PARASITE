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
  view = 'month';
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  eventsInitial: CalendarEvent[] = [];
  activeDayIsOpen: Boolean = true;
  refresh: Subject<any> = new Subject();
  editing = false;
  // NOTE: When integrated into profile, @Inputs will replace these values.
  // @Input() loggedInUser;
  // @Input() profileUser;
  loggedInUser = {
    children: [],
    isParent: true,
    isTeacher: false,
    isAdmin: false,
    isChild: false,
    username: 'alby',
  };
  profileUser = 'alby';
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: function({event}: {event: CalendarEvent}): void {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: function({event}: {event: CalendarEvent}): void {
        this.events = this.events.filter(function(iEvent) {
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




  constructor(private scheduleService: ScheduleService) { }

  ngOnInit() {

    const self = this;
    const indexChild = this.loggedInUser.children.indexOf(this.profileUser);
    if (this.loggedInUser.username === this.profileUser || !(indexChild === -1) ) {
    this.scheduleService.getPersonalSchedule(this.profileUser).subscribe(function(res) {
     // console.log(res.data);
      self.events = res.data;
      for (let index = 0; index < self.events.length; index++) {
        self.events[index].start = new Date(self.events[index].start);
        self.events[index].end = new Date(self.events[index].end);
      }
      });
    }
    this.refresh.next();
    this.fetchEvents();
    this.events.forEach(element => {
      const anEvent: CalendarEvent = {
        id : element.id,
        start : element.start,
        end : element.end,
        title : element.title,
        color : {
          primary : element.color.primary,
          secondary : element.color.secondary
        },
        actions : element.actions,
        allDay : element.allDay,
        cssClass : element.cssClass,
        resizable : element.resizable,
        draggable : element.draggable,
        meta : element.meta
      };
      anEvent.color.primary = element.color.primary;
      anEvent.color.secondary = element.color.secondary;
      this.eventsInitial.push(anEvent);
    });
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
    const self = this;
    setTimeout(function() {
      return self.refresh.next();
    }, 0);
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
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    setTimeout(function() {
      return this.refresh.next();
    }, 0);
  }

  isUnchanged(): boolean {
    return JSON.stringify(this.events) === JSON.stringify(this.eventsInitial);
  }

  refreshDocument() {
    const self = this;
    setTimeout(function() {
      return self.refresh.next();
    }, 0);
  }

  saveScheduleChanges() {
      const indexChild = this.loggedInUser.children.indexOf(this.profileUser);
      if ((this.profileUser === this.loggedInUser.username) || (!(this.loggedInUser.isChild) && indexChild !== -1)) {
        console.log('entered');
        this.scheduleService.saveScheduleChanges(this.profileUser, this.events).subscribe();
      }
      this.refresh.next();
      this.eventsInitial = [];
      this.events.forEach(element => {
        const anEvent: CalendarEvent = {
          id : element.id,
          start : element.start,
          end : element.end,
          title : element.title,
          color : {
            primary : element.color.primary,
            secondary : element.color.secondary
          },
          actions : element.actions,
          allDay : element.allDay,
          cssClass : element.cssClass,
          resizable : element.resizable,
          draggable : element.draggable,
          meta : element.meta
        };
        anEvent.color.primary = element.color.primary;
        anEvent.color.secondary = element.color.secondary;
        this.eventsInitial.push(anEvent);
      });
      this.editing = false;
      setTimeout(function() {
        return this.refresh.next();
      }, 0);
  }

  cancel() {
    this.editing = false;
    setTimeout(function() {
      return this.refresh.next();
    }, 0);
  }



}
