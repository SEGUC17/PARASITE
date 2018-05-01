import {
  Component, OnInit, Input, Output, ChangeDetectionStrategy,
  EventEmitter, ViewChild, TemplateRef} from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import { ScheduleService } from './schedule.service';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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

// allow jquery
declare const $: any;


@Component({
  selector: 'app-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  events: CalendarEvent[] = [];
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




  constructor(private scheduleService: ScheduleService, private route: ActivatedRoute,
     private _AuthService: AuthService, private translate: TranslateService) { }

  ngOnInit() {
    this._AuthService.getUserData(['username', 'isChild', 'children']).subscribe((user) => {
      this.loggedInUser.username = user.data.username;
      this.loggedInUser.isChild = user.data.isChild;
      this.loggedInUser.children = user.data.children;
      if (!this.profileUser) {
        this.route.params.subscribe(params => {
          this.profileUser = params.username;
          if (!this.profileUser) {
            this.profileUser = this.loggedInUser.username;
          }
        });
      }
      this.fetchAndDisplay();
    });

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
        self.headerChange();
      });
    }
  }


  headerChange(): void {
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
    this.activeDayIsOpen = false;
    this.refreshDocument();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  // new event creation handler
  createEvent(eventTitle: string, eventDescription: string, eventStart: Date, eventEnd: Date) {
    const newEvent = {
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
    };
    if (eventStart) {
      this.events.push(newEvent);
    } else {
      alert('Failed to create event: Event must have a start date');
    }

    $('#createStart').bootstrapMaterialDatePicker('_onClearClick');
    $('#createEnd').bootstrapMaterialDatePicker('_onClearClick');


    this.scheduleService.addEvent(this.profileUser, newEvent).subscribe();
    this.refreshDocument();
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
    if (editStart) {
      this.events[this.editIndex].title = editTitle;
      this.events[this.editIndex].meta.description = editDescription;
      this.events[this.editIndex].start = editStart;
      this.events[this.editIndex].end = editEnd;
    } else {
      alert('Failed to Edit event: Event must have a start date');
    }

    $('#editStart').bootstrapMaterialDatePicker('_onClearClick');
    $('#editEnd').bootstrapMaterialDatePicker('_onClearClick');


    this.scheduleService.saveScheduleChanges(this.profileUser, this.events).subscribe();
    this.refreshDocument();
  }

  // delete corresponding event
  delete(index) {
    this.events.splice(index, 1);
    this.refreshDocument();
  }

  refreshDocument() {
    // Light refresh to show any changes
    const self = this;
    setTimeout(function () {
      return self.refresh.next();
    }, 0);
  }

  cancel() {
    // Cancel changes, refresh schedule from database
    this.fetchAndDisplay();
    this.refreshDocument();
  }



}
