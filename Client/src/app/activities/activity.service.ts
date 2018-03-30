import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { apiUrl } from '../variables';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ActivityService {

  private activitiesUrl = apiUrl + 'activities';

  constructor(private http: HttpClient) { }

  getActivities(page): Observable<any> {
    
    return this.http.get<any>(`${this.activitiesUrl}?page=${page}`).pipe( );
  }

}
