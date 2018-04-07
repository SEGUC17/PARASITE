import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
@Injectable()
export class AuthService {

  private endpoint: String = 'http://localhost:3000/api';
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

  signOut(): void {
    localStorage.removeItem(this.localStorageTokenName);
  }

  getUserData(userDataColumns: Array<string>): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endpoint + '/userData', userDataColumns).pipe(
      catchError(self.handleError('getUserDataFromServer', []))
    );
  }

  getAnotherUserData(userDataColumns: Array<string>, username: string): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endpoint + '/userData/' + username, userDataColumns).pipe(
      catchError(self.handleError('getUserDataFromServer', []))
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

  childSignUp(user: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/childsignup', user);
  }

  setUser(user: any): void {
    this.user = user;
  }
  getUser(): any {
    return this.user;
  }


}
