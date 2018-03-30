import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { apiUrl } from '../variables';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ActivityService {
  /*
    @author: Wessam
  */

  private activitiesUrl = apiUrl + 'activities';

  constructor(private http: HttpClient) { }

  getActivities(page): Observable<any> {
    // Getting all activities
    return this.http.get<any>(`${this.activitiesUrl}?page=${page}`).pipe(
      catchError(this.handleError('getNumberOfContentPages', []))
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
