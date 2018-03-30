import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Content } from './content';

@Injectable()
export class ContentService {

  endpoint: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getContentPage(numberOfEntriesPerPage: any, pageNumber: any, category: any, section: any): Observable<any> {
    // TODO handle what happens with nulls by testing
    const self = this;
    return this.http.get(self.endpoint + 'content/getContentPage/' + numberOfEntriesPerPage +
      '/' + pageNumber + '/' + category + '/' + section)
      .pipe(
        catchError(self.handleError('getContentPage', []))
      );
  }

  getNumberOfContentPages(numberOfEntriesPerPage: any, category: any, section: any): Observable<any> {
    // TODO handle what happens with nulls by testing
    const self = this;
    return this.http.get(self.endpoint + 'content/numberOfContentPages/' +
      numberOfEntriesPerPage + '/' + category + '/' + section)
      .pipe(
        catchError(self.handleError('getNumberOfContentPages', []))
      );
  }

  getContentById(id: any): Observable<any> {
    const self = this;
    return this.http.get(self.endpoint + 'content/view/' + id)
      .pipe(
        catchError(self.handleError('getContentById', []))
      );
  }

  createContent(content: Content): Observable<any> {
    const self = this;
    return this.http.post(self.endpoint + 'content/create', content)
      .pipe(
        catchError(self.handleError('Create Content'))
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
