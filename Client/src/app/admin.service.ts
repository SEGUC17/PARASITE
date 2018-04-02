import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()


export class AdminService {
<<<<<<< HEAD
private baseURL = 'http://localhost:3000/api/';
private viewPendingContReqsURL = 'admin/PendingContentRequests/';
private respondContentRequestURL = 'admin/RespondContentRequest/';
private respondContentStatusURL = 'admin/RespondContentStatus/';
private getContent = 'admin/getContent/';
=======
  private baseURL = 'http://localhost:3000/api/';
  private viewPendingContReqsURL = 'admin/PendingContentRequests';
  private respondContentRequestURL = 'admin/RespondContentRequest/';
>>>>>>> 245784afe30f56d3e84eddb84911a96f77e1ccf2

  constructor(private http: HttpClient) { }

  getVerifiedContributerRequests(): any {
    // Make an HTTP GET Request AUTHOR: Maher.
    return 'Here are the requested Elements';
  }

<<<<<<< HEAD
    viewPendingContReqs(type): any {
      return this.http.get<any> (this.baseURL + this.viewPendingContReqsURL + type);
    }

    respondContentRequest( response , id): any {
      return this.http.patch<any> (this.baseURL + this.respondContentRequestURL + id , {str: response} );
    }
    modifyContentStatus(response , id: any): any {
       return this.http.patch<any> (this.baseURL + this.respondContentStatusURL + id , {str: response});
    }
    getcontent(): any {
      return this.http.get<any>(this.baseURL + this.getContent );
    }
=======
  viewPendingContReqs(): any {
    return this.http.get<any>(this.baseURL + this.viewPendingContReqsURL);
  }

  respondContentRequest(response, id): any {
    return this.http.patch<any>(this.baseURL + this.respondContentRequestURL + id, { str: response });
  }
>>>>>>> 245784afe30f56d3e84eddb84911a96f77e1ccf2

  // create a category for content (resrouces and ideas) to be classified into
  createCategory(category: any): Observable<any> {
    const self = this;
    return this.http.post(self.baseURL + 'content/category', category)
      .pipe(
        catchError(
          self.handleError('createCategory', [])
        )
      );
  }

  // create a section for content (resources and ideas) to be classified into
  createSection(categoryId: any, section: any): Observable<any> {
    const self = this;
    return this.http.post(self.baseURL + 'content/category/' + categoryId + '/section', section)
    .pipe(
      catchError(
        self.handleError('createSection', [])
      )
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
