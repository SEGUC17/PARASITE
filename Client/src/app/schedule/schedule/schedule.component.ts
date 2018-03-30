import { Component, OnInit , Input, Output, EventEmitter } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
//import { Schedule } from './schedule';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format
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
  view: string = 'month';

viewDate: Date = new Date();

events: CalendarEvent[] = [];
 //schedule: Schedule;
  constructor() { }

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
      title: 'Draggable event',
      color: colors.yellow,
      start: new Date(),
      draggable: true
    },
    {
      title: 'A non draggable event',
      color: colors.blue,
      start: new Date()
    }
  ]
}

publish(): void {
  alert("Implement Publish Study Plan!");
}

copy(): void {
  alert("Implement Copy Study Plan!");
}

assign(): void {
  alert("Implement Assign Study Plan!");
}

edit(): void {
  alert("Implement Edit Study Plan!");
}

}
