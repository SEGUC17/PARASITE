import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
@Injectable()
export class AuthService {

  private endpoint: String = 'http://localhost:3000/api';
  private jwtLocalStorageName = 'jwtToken';

  constructor(private http: HttpClient) { }

  setToken(token: string): void {
    if (token) {
      localStorage.setItem(this.jwtLocalStorageName, token);
    }
  }

  getToken(): string {
    if (localStorage.length) {
      return localStorage.getItem(this.jwtLocalStorageName);
    }

    return '';
  }

  signUp(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endpoint + '/signup', user).pipe(
      catchError(self.handleError('signUp', []))
    );
  }

  signIn(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endpoint + '/signin', user).pipe(
      catchError(self.handleError('signIn', []))
    );
  }

  getUser(): any { }

  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      return of(result as T);
    };
  }

}