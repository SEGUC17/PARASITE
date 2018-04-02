import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {catchError} from "rxjs/operators";
import {of} from "rxjs/observable/of";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()

export class ProfileService {

// ------------- Profile Page Method(s) -------------- AUTHOR: H
  constructor(private http: HttpClient) { }

  private Url = 'http://localhost:3000/api/profile/';
  getUserInfo(username: String): Observable<any> {
      return this.http.get(`${this.Url}/${username}`);
    }

// --------Sending Contributer Validation Request --------- AUTHOR: Maher
  makeContributerValidationRequest(requestObj): any {
    // TODO: Send an HTTP POST for the request (Maher).
    console.log('the Request is sent el mafrood AUTHOR: Maher');
    var self = this;
    return this.http.post(
      this.Url + 'VerifiedContributerRequest',
      { obj: requestObj })
    .pipe(
        catchError(self.handleError('getNumberOfContentByCreator', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {

    return function (error: any): Observable<T> {

      //console.error(error); // log to console instead
      alert('The request have been submitted');

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
