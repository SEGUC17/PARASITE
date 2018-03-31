import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
<<<<<<< HEAD
=======
import { Observable } from 'rxjs/Observable';
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

<<<<<<< HEAD
@Injectable()
export class ProfileService {
// TODO: Write Profile Service AUTHOR: Maher
=======

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
    return this.http.post('http://localhost:3000/api/profile/VerifiedContributerRequest', 'maherUSERNAME');
  }


>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
}
