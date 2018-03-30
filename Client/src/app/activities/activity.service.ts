import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { apiUrl } from '../variables';
import { ActivityCreate } from './activity';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ActivityService {
  /*
    @author: Wessam
  */

  private activitiesUrl = apiUrl + 'activities';

  constructor(private http: HttpClient, private router: Router) { }

  getActivities(page): Observable<any> {
    // Getting all activities
    return this.http.get<any>(`${this.activitiesUrl}?page=${page}`).pipe(
      catchError(this.handleError('getNumberOfActivityPages', []))
    );
  }

  getActivity(activityId): Observable<any> {
    return this.http.get<any>(`${this.activitiesUrl}/${activityId}`).pipe(
      catchError(this.handleError('retrivingActivity', []))
    );
  }

  postActivities(activity: ActivityCreate): Observable<any> {
    //TODO: redirect to activities incase some error happens
    return this.http.post<any>(this.activitiesUrl, activity).pipe(
      catchError(this.handleError('creatingActivity', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {

      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
