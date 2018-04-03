import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }
  endpoint: String = 'http://localhost:3000/api/';
  user: any = {
    username: 'ahmed',
    isAdmin: true
  };
  authHeader: Headers = new Headers();

  signUp(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>("http://localhost:3000/api/signup", user).pipe(
      catchError(self.handleError('signUp', [])));

  }//end method


  Login(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>("http://localhost:3000/api/signin", user).pipe(
      catchError(self.handleError('Login', [])));

  }//end method

  private handleError<T>(operation = 'operation', result?: T) {

    return function (error: any): Observable<T> {

      alert(error.error.msg);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  setUser(user: any): void {
    this.user = user;
  }
  getUser(): any {
    return this.user;
  }
}// end class
