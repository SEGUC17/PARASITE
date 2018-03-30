import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }
  endpoint: String = 'http://localhost:3000/api/'

  signUp(user: any): Observable<any>{
           return this.http.post<any>("http://localhost:3000/api/signUp",user);
  }





}
