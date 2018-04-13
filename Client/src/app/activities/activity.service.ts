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
  private unverifiedActivitiesUrl = apiUrl + 'unverifiedActivities';

  constructor(private http: HttpClient, private router: Router) { }

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

  postCommentOnActivity(activityId: any, comment: any) {
    return this.http.post<any>(this.activitiesUrl + '/'
      + activityId + '/comments', {text: comment}).
    pipe(
      catchError(this.handleError('creatingActivity', []))
    );
  }
  // '/activities/:activityId/comments/:commentId'
  getCommentOnActivity(activityId: any, commentId: any) {
    return this.http.get<any>(this.activitiesUrl + '/'
      + activityId + '/comments/' + commentId).
    pipe(
      catchError(this.handleError('creatingActivity', []))
    );
  }

  postReplyOnCommentOnActivity(activityId: any, commentId: any, Reply: any) {
    return this.http.post<any>(this.activitiesUrl + '/'
      + activityId + '/comments/' + commentId + '/replies', {text: Reply}).
    pipe(
      catchError(this.handleError('creatingActivity', []))
    );
  }
  deleteCommentOnActivity(activityId: any, commentId: any) {
    return this.http.delete(this.activitiesUrl + '/'
    + activityId + '/comments/' + commentId).
    pipe(
      catchError(this.handleError('creatingActivity', []))
    );
  }

  deleteReplyOnCommentOnActivity(activityId: any, commentId: any, replyId: any) {
    return this.http.delete(this.activitiesUrl + '/'
      + activityId + '/comments/' + commentId + '/replies/' + replyId).
    pipe(
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
