import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'angular-calendar';
import { environment } from '../../../environments/environment';

@Injectable()
export class ScheduleService {


  constructor(private http: HttpClient) { }

  getPersonalSchedule(username: String): Observable<any> {
    return this.http.get(environment.apiUrl + 'schedule/getPersonalSchedule/' + username);
  }


  saveScheduleChanges(username: String, schedule: CalendarEvent[]): Observable<any> {
    return this.http.patch(environment.apiUrl + 'schedule/SaveScheduleChanges/' + username, schedule);
  }

  scheduleActivity(username: String, activity: any): Observable<any> {
    const newEvent = {
      color: {
        primary: '#000000',
        secondary: '#BEBEBE'
      },
      start: activity.fromDateTime,
      end: activity.toDateTime,
      title: activity.name,
      draggable: false,
      meta: { description: 'URL to activity here' },
      resizable: {
        beforeStart: false,
        afterEnd: false
      }
    };
    return this.http.put(environment.apiUrl + 'schedule/addEvent/' + username, newEvent);

  }

  addEvent(username: String, newEvent: CalendarEvent): Observable<any> {
    return this.http.put(environment.apiUrl + 'schedule/addEvent/' + username, newEvent);

  }

}
