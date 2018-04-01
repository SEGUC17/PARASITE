import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()


export class AdminService {
private baseURL = 'http://localhost:3000/api/';
private viewPendingContReqsURL = 'admin/PendingContentRequests';
private respondContentRequestURL = 'admin/RespondContentRequest/';

  constructor(private http: HttpClient) {}

    getVerifiedContributerRequests(): any {
      // Make an HTTP GET Request AUTHOR: Maher.
      return 'Here are the requested Elements';
    }

    viewPendingContReqs(): any {
      return this.http.get<any> (this.baseURL + this.viewPendingContReqsURL);
    }

    respondContentRequest( response , id): any {
      return this.http.patch<any> (this.baseURL + this.respondContentRequestURL + id , {str: response} );
    }


}
