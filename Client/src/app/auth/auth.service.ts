import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
@Injectable()
export class AuthService {

  private endpoint: String = 'http://localhost:3000/api';
  private localStorageTokenName = 'jwtToken';

  constructor(private http: HttpClient) { }

  setToken(token: string): void {
    if (token) {
      localStorage.setItem(this.localStorageTokenName, token);
    }
  }

  getToken(): string {
    const token = localStorage.getItem(this.localStorageTokenName);
    return token ? token : '';
  }

  signUp(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endpoint + '/signUp', user).pipe(
      catchError(self.handleError('signUp', []))
    );
  }

  signIn(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endpoint + '/signIn', user).pipe(
      catchError(self.handleError('signIn', []))
    );
  }

  getUserData(userDataColumns: Array<string>): any {
    let userData;
    this.getUserDataFromServer(userDataColumns).subscribe(function(res) {
      userData = res.data;
    });

    return userData;
  }

  getUserDataFromServer(userDataColumns: Array<string>): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endpoint + '/userData', userDataColumns).pipe(
      catchError(self.handleError('getUserDataFromServer', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      return of(result as T);
    };
  }

}
