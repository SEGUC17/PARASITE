import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()


export class AdminService {
private baseURL = 'http://localhost:3000/api/';
private viewPendingContReqsURL = 'admin/PendingContentRequests/';
private respondContentRequestURL = 'admin/RespondContentRequest/';
private respondContentStatusURL = 'admin/RespondContentStatus/';
private getContent = 'admin/getContent/';

  constructor(private http: HttpClient) {}

    getVerifiedContributerRequests(): any {
      // Make an HTTP GET Request AUTHOR: Maher.
      return 'Here are the requested Elements';
    }

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


}
