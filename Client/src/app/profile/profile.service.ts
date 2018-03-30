import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()

export class ProfileService {

// ------------- Profile Page Method(s) -------------- AUTHOR: H
  constructor(private http: HttpClient) { }

  private Url = 'http://localhost:3000/api/profile/'
  getUserInfo(username: String): Observable<any> {
      return this.http.get(`${this.Url}/${username}`);
    }

// --------Sending Contributer Validation Request --------- AUTHOR: Maher
  makeContributerValidationRequest(): any {
    // TODO: Send an HTTP POST for the request (Maher).
    console.log('the Request is sent el mafrood AUTHOR: Maher');
    return this.http.post('http://localhost:3000/api/profile/VerifiedContributerReques', 'maherUSERNAME');
  }


}
