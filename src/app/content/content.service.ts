import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Content } from './content';
import { MatSnackBar } from '@angular/material';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class ContentService {

  endpoint: String = environment.apiUrl;

  constructor(private http: HttpClient, private toasterService: ToastrService) { }

  getContentById(id: any): Observable<any> {
    const self = this;
    return this.http.get(self.endpoint + 'content/view/' + id);
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
      '&section=' + section);
  }

  getCategories(): Observable<any> {
    const self = this;
    return this.http.get(self.endpoint + 'content/category')
      .pipe(
        catchError(self.handleError('Loading page', []))
      );
  }

  // delete content (ideas or categories) by id
  deleteContentById(contentId: any): Observable<any> {
    const self = this;
    return this.http.delete(self.endpoint + 'content/' + contentId)
      .pipe(
        catchError(self.handleError('Deleting content', []))
      );
  }
  // get search page from server
  getSearchPage(currentPageNumber: number,
    numberOfEntriesPerPage: number,
    searchQuery: String,
    selectedCategory: String,
    selectedSection: String,
    sortResultsBy: String,
    contentLanguage: String
  ): Observable<any> {

    const self = this;

    // encoding the search queries for sending
    searchQuery = encodeURIComponent(searchQuery.toString());
    selectedCategory = encodeURIComponent(selectedCategory.toString());
    selectedSection = encodeURIComponent(selectedSection.toString());
    sortResultsBy = encodeURIComponent(sortResultsBy.toString());
    contentLanguage = encodeURIComponent(contentLanguage.toString());

    return this.http.get(self.endpoint + 'content/' + numberOfEntriesPerPage +
      '/' + currentPageNumber + '/search?searchQuery=' +
      searchQuery + '&category=' + selectedCategory + '&section=' + selectedSection
      + '&sort=' + sortResultsBy + '&language=' + contentLanguage);
  }

  // Add learning score
  addLearningScore(contentId: any, videoUrl: any): Observable<any> {
    const self = this;
    return this.http.
      post(this.endpoint + 'content/' + contentId + '/score', {videoUrl: videoUrl})
      .pipe(
        catchError(self.handleError('Sign in to get learning points', []))
      );
  }

  // general error handler
  private handleError<T>(operation = 'operation', result?: T) {
    const self = this;
    return function (error: any): Observable<T> {

      self.toasterService.error(operation + ' failed, please try again', 'failure');
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
