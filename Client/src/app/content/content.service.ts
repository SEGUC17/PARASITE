import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Content } from './content';
import { MatSnackBar } from '@angular/material';


@Injectable()
export class ContentService {

  endpoint: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

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

  updateContent(content: Content): Observable<any> {
    const self = this;
    return this.http.patch(self.endpoint + 'content', content)
      .pipe(
        catchError(self.handleError('Update Content'))
      );
  }


  getContentByCreator(pageSize: any, pageNumber: any,
    category: String, section: String): Observable<any> {
    const self = this;
    category = encodeURIComponent(category.toString());
    section = encodeURIComponent(section.toString());
    return this.http.get(self.endpoint + 'content/username/' +
      pageSize + '/' + pageNumber + '/categorization?category=' + category +
      '&section=' + section)
      .pipe(
        catchError(self.handleError('getContentByCreator', []))
      );
  }

  getCategories(): Observable<any> {
    const self = this;
    return this.http.get(self.endpoint + 'content/category')
      .pipe(
        catchError(self.handleError('getCategories', []))
      );
  }

  // delete content (ideas or categories) by id
  deleteContentById(contentId: any): Observable<any> {
    const self = this;
    return this.http.delete(self.endpoint + 'content/' + contentId)
      .pipe(
        catchError(self.handleError('deleteContent', []))
      );
  }
  // get search page from server
  getSearchPage(currentPageNumber: number,
    numberOfEntriesPerPage: number,
    searchQuery: String,
    selectedCategory: String,
    selectedSection: String,
    sortResultsBy: String
  ): Observable<any> {

    const self = this;

    // encoding the search queries for sending
    searchQuery = encodeURIComponent(searchQuery.toString());
    selectedCategory = encodeURIComponent(selectedCategory.toString());
    selectedSection = encodeURIComponent(selectedSection.toString());
    sortResultsBy = encodeURIComponent(sortResultsBy.toString());

    return this.http.get(self.endpoint + 'content/' + numberOfEntriesPerPage +
      '/' + currentPageNumber + '/search?searchQuery=' +
      searchQuery + '&category=' + selectedCategory + '&section=' + selectedSection
      + '&sort=' + sortResultsBy)
      .pipe(
        catchError(self.handleError('getSearchPage', []))
      );
  }

  // Add learning score
  addLearningScore(contentId: any): Observable<any> {
    return this.http.post(this.endpoint + 'content/' + contentId + '/score', {});
  }

  // general error handler
  private handleError<T>(operation = 'operation', result?: T) {
    const self = this;
    return function (error: any): Observable<T> {

      self.snackBar.open(operation + ' failed. Please try again later.', 'Undo', {
        duration: 3000
      });
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
