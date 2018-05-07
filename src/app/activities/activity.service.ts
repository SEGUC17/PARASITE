import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { apiUrl } from '../variables';
import { ActivityCreate, ActivityEdit } from './activity';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Activity } from './activity';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ActivityService {
  /*
    @author: Wessam
  */

  private activitiesUrl = environment.apiUrl + 'activities';
  private unverifiedActivitiesUrl = environment.apiUrl + 'unverifiedActivities';

  constructor(private http: HttpClient, private router: Router) { }

  getPendingActivities(page): Observable<any> {
    /*
      Getting all activities
    */
    return this.http.get<any>(`${this.activitiesUrl}?page=${page}&status=pending`).pipe(
      catchError(this.handleError('getNumberOfActivityPages', []))
    );
  }

  getActivities(page): Observable<any> {
    /*
      Getting all activities
    */
    return this.http.get<any>(`${this.activitiesUrl}?page=${page}`).pipe(
      catchError(this.handleError('getNumberOfActivityPages', []))
    );
  }

  getActivity(activityId): Observable<any> {
    /*
      Getting an activity by id
    */
    return this.http.get<any>(`${this.activitiesUrl}/${activityId}`).pipe(
      catchError(this.handleError('retrivingActivity', []))
    );
  }

  postActivities(activity: ActivityCreate): Observable<any> {
    /*
      Post request to create activity
    */
    return this.http.post<any>(this.activitiesUrl, activity).pipe(
      catchError(this.handleError('creatingActivity', []))
    );
  }

  reviewActivity(activity: any): Observable<any> {
    /*
      Put request to update activity's status
    */
    return this.http.put<any>( this.unverifiedActivitiesUrl, activity );
  }

  deleteActivity(activity: any): Observable<any> {
    return this.http.delete(this.activitiesUrl + '/' + activity._id);
  }

  bookActivity(activity: any, body: any): Observable<any> {
    return this.http.post<any>(this.activitiesUrl + '/' + activity._id + '/book', body);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  EditActivity(activity: ActivityEdit, id: any) {
    return this.http.patch( this.activitiesUrl + '/' + id + '/EditActivity', activity);
  }
  EditActivityImage(upload , id): any {
    return this.http.patch( this.activitiesUrl + '/' + id + '/EditActivityImage', upload);
  }

  testML(): Observable<any> {
    return this.http.post<any>(environment.apiUrl + 'testencoder' , []);
  }

}
