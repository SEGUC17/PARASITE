import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'angular-calendar';

@Injectable()
export class ScheduleService {

  endpoint: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

getPersonalSchedule(username: String): Observable<any> {
    return this.http.get(this.endpoint + 'schedule/getPerosnalSchedule/' + username);
}


  saveScheduleChanges(username: String, schedule: CalendarEvent[] ) {
    return this.http.patch(this.endpoint + 'schedule/saveScheduleChanges/' + username, schedule);
    // TODO: To be implemented in backend by Omar Elsebai
  }

}
