import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { environment } from '../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class DiscussionService {

  // @AUTHOR: Maher, Salma Ghoneim.
  // The Discussion.Service is the Service responsible for all the comments
  // controls in the Activity page and the content page.

  private activitiesUrl = environment.apiUrl + 'activities';
  private contentUrl = environment.apiUrl + 'content';

  constructor(private http: HttpClient) {}

  postCommentOnActivity(activityId: any, comment: any) {
    return this.http.post<any>(this.activitiesUrl + '/'
      + activityId + '/comments', {text: comment}).
    pipe(
      catchError(this.handleError('Posting a comment on an Activity', []))
    );
  }

  getCommentOnActivity(activityId: any, commentId: any) {
    return this.http.get<any>(this.activitiesUrl + '/'
      + activityId + '/comments/' + commentId).
    pipe(
      catchError(this.handleError('getting a comment on an Activity', []))
    );
  }

  postReplyOnCommentOnActivity(activityId: any, commentId: any, Reply: any) {
    return this.http.post<any>(this.activitiesUrl + '/'
      + activityId + '/comments/' + commentId + '/replies', {text: Reply}).
    pipe(
      catchError(this.handleError('Posting a reply on a comment on an Activity', []))
    );
  }
  deleteCommentOnActivity(activityId: any, commentId: any) {
    return this.http.delete(this.activitiesUrl + '/'
      + activityId + '/comments/' + commentId).
    pipe(
      catchError(this.handleError('deleting a comment on an Activity', []))
    );
  }

  deleteReplyOnCommentOnActivity(activityId: any, commentId: any, replyId: any) {
    return this.http.delete(this.activitiesUrl + '/'
      + activityId + '/comments/' + commentId + '/replies/' + replyId).
    pipe(
      catchError(this.handleError('deleting a reply on a comment on an Activity', []))
    );
  }

  postCommentOnContent(contentId: any, comment: any) {
    return this.http.post<any>(this.contentUrl + '/'
      + contentId + '/comments', {text: comment}).
    pipe(
      catchError(this.handleError('Posting a comment on a Content', []))
    );
  }

  getCommentOnContent(contentId: any, commentId: any) {
    return this.http.get<any>(this.contentUrl + '/'
      + contentId + '/comments/' + commentId).
    pipe(
      catchError(this.handleError('getting a comment on a Content', []))
    );
  }

  postReplyOnCommentOnContent(contentId: any, commentId: any, Reply: any) {
    return this.http.post<any>(this.contentUrl + '/'
      + contentId + '/comments/' + commentId + '/replies', {text: Reply}).
    pipe(
      catchError(this.handleError('replying on a comment on a Content', []))
    );
  }

  deleteCommentOnContent(contentId: any, commentId: any) {
    return this.http.delete(this.contentUrl + '/'
      + contentId + '/comments/' + commentId).
    pipe(
      catchError(this.handleError('Deleting a comment on a Content', []))
    );
  }

  deleteReplyOnCommentOnContent(contentId: any, commentId: any, replyId: any) {
    return this.http.delete(this.contentUrl + '/'
      + contentId + '/comments/' + commentId + '/replies/' + replyId).
    pipe(
      catchError(this.handleError('Deleting a reply on comment on a Content', []))
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
