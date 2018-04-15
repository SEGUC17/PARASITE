import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RatingService {
  endpoint: String = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) { }
  rate(userRating): Observable<any> {
    return this.http.put(this.endpoint + 'rating', userRating).pipe(
      catchError(this.handleError('rating'))
    );
  }

  // general error handler
  private handleError<T>(operation = 'operation', result?: T) {

    return function (error: any): Observable<T> {

      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
