import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalendarEvent } from 'angular-calendar';

@Injectable()
export class ScheduleService {

  endpoint: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  saveScheduleChanges(username: String, schedule: CalendarEvent[] ) {
    return this.http.patch(this.endpoint + 'schedule/saveScheduleChanges/' + username, schedule);
    // TODO: To be implemented in backend by Omar Elsebai
  }

}
