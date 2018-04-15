import { apiUrl } from '../variables';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
@Injectable()
export class AuthService {

  private endPoint: String = apiUrl;
  private localStorageTokenName = 'jwtToken';
  // Added To Satisfy Merge
  user: any;

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
    return this.http.post<any>(this.endPoint + 'signUp', user).pipe(
      catchError(self.handleError('signUp', []))
    );
  }

  signIn(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endPoint + 'signIn', user).pipe(
      catchError(self.handleError('signIn', []))
    );
  }

  signOut(): void {
    localStorage.removeItem(this.localStorageTokenName);
  }

  getUserData(userDataColumns: Array<string>): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endPoint + 'userData', userDataColumns).pipe(
      catchError(self.handleError('getUserDataFromServer', []))
    );
  }

  getAnotherUserData(userDataColumns: Array<string>, username: string): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endPoint + 'userData/' + username, userDataColumns).pipe(
      catchError(self.handleError('getUserDataFromServer', []))
    );
  }

  childSignUp(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endPoint + 'childsignup', user).pipe(
      catchError(self.handleError('childsignup', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      if (operation !== 'getUserDataFromServer') {
        alert(error.error.msg);
      }
      return of(result as T);
    };
  }

  setUser(user: any): void {
    this.user = user;
  }
  getUser(): any {
    return this.user;
  }

}
