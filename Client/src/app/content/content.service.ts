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
    return this.http.post(self.endpoint + 'content', content)
      .pipe(
        catchError(self.handleError('Create Content'))
      );
  }

  getContentByCreator(username: any, pageSize: any, pageNumber: any): Observable<any> {
    const self = this;
    return this.http.get(self.endpoint + 'content/username/' + username + '/' + pageSize + '/' + pageNumber)
      .pipe(
        catchError(self.handleError('getContentByCreator', []))
      );
  }

  getNumberOfContentByCreator(username: any): Observable<any> {
    const self = this;
    return this.http.get(self.endpoint + 'content/username/count/' + username)
      .pipe(
        catchError(self.handleError('getNumberOfContentByCreator', []))
      );
  }

  getCategories(): Observable<any> {
    const self = this;
    return this.http.get(self.endpoint + 'content/category')
      .pipe(
        catchError(self.handleError('getCategories', []))
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
