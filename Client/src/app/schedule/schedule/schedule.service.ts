import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'angular-calendar';

@Injectable()
export class ScheduleService {

  endpoint: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getPersonalSchedule(username: String): Observable<any> {
    return this.http.get(this.endpoint + 'schedule/getPersonalSchedule/' + username);
  }


  saveScheduleChanges(username: String, schedule: CalendarEvent[]): Observable<any> {
    return this.http.patch(this.endpoint + 'schedule/SaveScheduleChanges/' + username, schedule);
  }

  scheduleActivity(username: String, activity: any): Observable<any> {
    const newEvent = {
      start: activity.fromDateTime,
      end: activity.toDateTime,
      title: activity.name
    };
    return this.http.put(this.endpoint + 'schedule/addEvent/' + username, newEvent);

  }

}
