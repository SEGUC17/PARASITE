import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ScheduleService } from './schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  // TODO: To be obtained from server in viewPersonalSchedule by Dalia
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
  }

  deleteEvent(event: CalendarEvent, targetUser: String) {
    // FIXME: To be modified for obtaining logged in user's data and profile owner's username
    if (this.thisUser.isParent) {
      const indexChild = this.thisUser.children.indexOf(targetUser);
      const index = this.schedule.indexOf(event);
      if (index === -1) {
        return; }
        // Error: Event not found
      if ((targetUser === this.thisUser.username) || (this.thisUser.isParent && indexChild !== -1)) {
        this.schedule.splice(index, 1);
      }
    }
  }

  saveScheduleChanges(targetUser: String) {
    // FIXME: To be modified for obtaining logged in user's data and profile owner's username
    // TODO: To be implemented in backend
    const indexChild = this.thisUser.children.indexOf(targetUser);
    if ((targetUser === this.thisUser.username) || (this.thisUser.isParent && indexChild !== -1)) {
      this.scheduleService.saveScheduleChanges(targetUser, this.schedule);
    }
  }



}
