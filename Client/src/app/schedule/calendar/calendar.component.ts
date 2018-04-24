import { Subject } from 'rxjs/Subject';
import { NgModel } from '@angular/forms';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
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

declare const $: any;

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
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  // events CRUD inputs
  @Input() events: CalendarEvent[];
  @Input() onCreate;
  @Input() onEdit;
  @Input() onDelete;
  createTitle = '';
  // Calendar API view control
  view = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen: Boolean = false;
  refresh: Subject<any> = new Subject();
  // datetime picker variables
  start = '';
  end = '';
  // actions for events
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

  constructor() { }

  ngOnInit() {
    // modals
    $('#createModal').appendTo('body');
    $('#editModal').appendTo('body');
    $('#deleteModal').appendTo('body');

    // datetime pickers
    $('.datetimepicker').bootstrapMaterialDatePicker({
      format: 'dddd DD MMMM YYYY - HH:mm',
      clearButton: true,
      weekStart: 1
    });

    let self = this;

    $('#createStart').bootstrapMaterialDatePicker().on('beforeChange', function (e, date) {
      self.start = date._d;
    });

    $('#createEnd').bootstrapMaterialDatePicker().on('beforeChange', function (e, date) {
      self.end = date._d;
    });

    // form validation
    $('#createForm').validate({
      highlight: function (input) {
        $(input).parents('.form-group').addClass('error');
      },
      unhighlight: function (input) {
        $(input).parents('.form-group').removeClass('error');
      },
      errorPlacement: function (error, element) {
        $(element).parents('.form-group').append(error);
      }
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

  // event change handler
  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
  }

}
