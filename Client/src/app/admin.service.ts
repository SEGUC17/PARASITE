import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()


export class AdminService {
private URL = 'http://localhost:3000/api/admin/PendingContentRequests';

  constructor(private http: HttpClient) {}

    getVerifiedContributerRequests(): any {
      // Make an HTTP GET Request AUTHOR: Maher.
      return 'Here are the requested Elements';
    }

    viewPendingReqs(): any {
      console.log('in service');
      return this.http.get<any> (this.URL);
    }

    getProducts(): any {
      return this.http.get<any[]>(this.URL);
  }
}
