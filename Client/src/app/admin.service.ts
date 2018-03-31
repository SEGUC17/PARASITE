import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()


export class AdminService {
private URL = 'http://localhost:3000/api/admin/';

  constructor(private http: HttpClient) {}

  getVerifiedContributerRequests(): any {
    // Make an HTTP GET Request AUTHOR: Maher.
    return 'Here are the requested Elements';
  }

  viewPendingReqs(): any {
    console.log('in service');
    return this.http.get<any> (this.URL + 'PendingContentRequests');
  }

  viewPendingVCR(FilterBy): any {
    return this.http.get(this.URL + 'VerifiedContributerRequests/' + FilterBy);
  }


  respondToContributerValidationRequest(id, resp): any {
    console.log('the Responce is sent el mafrood AUTHOR: Maher');
    return this.http.patch(
      this.URL + 'VerifiedContributerRequestRespond/' + id,
      {responce: resp}
      ).subscribe();

  }

}
