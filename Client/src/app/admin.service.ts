import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AdminService {

    getVerifiedContributerRequests(): any {
      // Make an HTTP GET Request AUTHOR: Maher.
      return 'Here are the requested Elements';
    }

    test() {
      // Test
    }
}
