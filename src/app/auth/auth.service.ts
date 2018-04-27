import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FacebookService, InitParams, LoginOptions, LoginResponse } from 'ngx-facebook';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class AuthService {

  private localStorageTokenName = 'jwtToken';

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private router: Router,
    private facebookService: FacebookService
  ) {
    let initParams: InitParams = {
      appId: environment.facebookAppID,
      xfbml: true,
      version: 'v2.8'
    };

    facebookService.init(initParams);
  }

  setToken(token: any): void {
    if (token) {
      localStorage.setItem(this.localStorageTokenName, token);
    } else {
      localStorage.removeItem(this.localStorageTokenName);
    }
  }

  getToken(): string {
    return localStorage.getItem(this.localStorageTokenName);
  }

  signUp(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>(environment.apiUrl + 'signUp', user).pipe(
      catchError(self.handleError('signUp', []))
    );
  }

  verifyEmail(id: any): Observable<any> {
    const self = this;
    return this.http.get<any>(environment.apiUrl + 'verifyEmail/' + id).pipe(
      catchError(self.handleError('verifyEmail', []))
    );
  }

  verifyChildEmail(id: any): Observable<any> {
    const self = this;
    return this.http.get<any>(environment.apiUrl + 'verifyChildEmail/' + id).pipe(
      catchError(self.handleError('verifyChildEmail', []))
    );
  }

  signIn(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>(environment.apiUrl + 'signIn', user).pipe(
      catchError(self.handleError('signIn', []))
    );
  }

  signUpInWithFacebook() {
    const self = this;

    this.facebookService.login()
      .then(function (res: LoginResponse) {
        self.authFacebook(res.authResponse).subscribe(function (res2) {
          if (res2.msg === 'Sign In Is Successful!') {
            self.setToken(res2.token);
            self.toastrService.success(res2.msg, 'Welcome!');
            self.router.navigate(['/']);
          }
        });
      })
      .catch(this.handleError);
  }

  authFacebook(authResponse): Observable<any> {
    const self = this;
    return this.http.post<any>(environment.apiUrl + 'auth/facebook', authResponse).pipe(
      catchError(self.handleError('authFacebook', []))
    );
  }

  isSignedIn(): Observable<any> {
    const self = this;
    return this.http.get<any>(environment.apiUrl + 'isSignedIn').pipe(
      catchError(self.handleError('isSignedIn', []))
    );
  }

  signOut(): void {
    localStorage.removeItem(this.localStorageTokenName);
  }

  getUserData(userDataColumns: Array<string>): Observable<any> {
    const self = this;
    return this.http.post<any>(environment.apiUrl + 'userData', userDataColumns).pipe(
      catchError(self.handleError('getUserData', []))
    );
  }

  getAnotherUserData(userDataColumns: Array<string>, username: string): Observable<any> {
    const self = this;
    return this.http.post<any>(environment.apiUrl + 'userData/' + username, userDataColumns).pipe(
      catchError(self.handleError('getAnotherUserData', []))
    );
  }

  childSignUp(user: any): Observable<any> {
    const self = this;
    return this.http.post<any>(environment.apiUrl + 'childsignup', user).pipe(
      catchError(self.handleError('childsignup', []))
    );
  }


  forgotPassword(email): any {
    const self = this;
    return this.http.get<any>(environment.apiUrl + 'forgotPassword/' + email).pipe(
      catchError(self.handleError('forgotPassword', []))
    );
  }

  resetPassword(id, pws: any): Observable<any> {
    const self = this;
    return this.http.patch<any>(environment.apiUrl + 'forgotPassword/resetpassword/' + id, pws, httpOptions).pipe(
      catchError(self.handleError('resetPassword', []))
    );
  }

  public handleError<T>(operation = 'operation', result?: T) {
    const self = this;
    return function (error: any): Observable<T> {
      if (
        operation === 'signUp' ||
        operation === 'verifyEmail' ||
        operation === 'signIn' ||
        operation === 'authFacebook' ||
        operation === 'childsignup' ||
        operation === 'verifyChildEmail' ||
        operation === 'forgotPassword' ||
        operation === 'resetPassword'
      ) {
        self.toastrService.error(error.error.msg);
      }
      return of(result as T);
    };
  }

}
