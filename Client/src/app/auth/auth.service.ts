import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class AuthService {

  private endPoint: String = environment.apiUrl;
  private localStorageTokenName = 'jwtToken';

  constructor(private http: HttpClient) { }

  setToken(token: string): void {
    localStorage.setItem(this.localStorageTokenName, token);
  }

  getToken(): string {
    return localStorage.getItem(this.localStorageTokenName);
  }

  signUp(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endPoint + 'signUp', user).pipe(
      catchError(self.handleError('signUp', []))
    );
  }

  verifyEmail(id: any): Observable<any> {
    const self = this;
    return this.http.get<any>(this.endPoint + 'verifyEmail/' + id).pipe(
      catchError(self.handleError('verifyEmail', []))
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
      catchError(self.handleError('getUserData', []))
    );
  }

  getAnotherUserData(userDataColumns: Array<string>, username: string): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endPoint + 'userData/' + username, userDataColumns).pipe(
      catchError(self.handleError('getAnotherUserData', []))
    );
  }

  childSignUp(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>(this.endPoint + 'childsignup', user).pipe(
      catchError(self.handleError('childsignup', []))
    );
  }

  resetpassword(email): any {
    const self = this;
    return this.http.get<any>(this.endPoint + 'resetpassword/' + email).pipe(
      catchError(self.handleError('resetpassword', []))
    );

  }

  ChangePassword(email, pws): Observable<any> {
    const self = this;
    return this.http.patch<any>(this.endPoint + 'changepassword/' + email, pws, httpOptions).pipe(
      catchError(self.handleError('changepassword', []))
    );

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      alert(error.error.msg);
      return of(result as T);
    };
  }

}
