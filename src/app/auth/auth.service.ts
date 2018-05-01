import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FacebookService, InitParams, LoginOptions, LoginResponse } from 'ngx-facebook';
import { GoogleApiService, GoogleAuthService } from 'ng-gapi';
import GoogleUser = gapi.auth2.GoogleUser;

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
    private facebookService: FacebookService,
    private googleApiService: GoogleApiService,
    private googleAuthService: GoogleAuthService
  ) {
    let initParams: InitParams = {
      appId: environment.facebookAppID,
      xfbml: true,
      version: 'v2.8'
    };

    facebookService.init(initParams);

    googleApiService.onLoad().subscribe(function () { });
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

  signInWithFacebook() {
    const self = this;

    this.facebookService.login()
      .then(function (res: LoginResponse) {
        self.authFacebook(res.authResponse).subscribe(function (res2) {
          if (res2.msg === 'Sign In Is Successful!') {
            self.setToken(res2.token);
            self.toastrService.success(res2.msg, 'Welcome!');
            self.router.navigateByUrl('/content/list');
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

  signInWithGoogle() {
    const self = this;
    this.googleAuthService.getAuth().subscribe(function(res) {
      res.signIn()
      .then(function(res2: GoogleUser) {
        let user = {
          'email': res2.getBasicProfile().getEmail(),
          'firstName': res2.getBasicProfile().getGivenName(),
          'googleId': res2.getBasicProfile().getId(),
          'imageUrl': res2.getBasicProfile().getImageUrl(),
          'lastName': res2.getBasicProfile().getFamilyName()
        };
        self.authGoogle(user).subscribe(function(res3) {
          if (res3.msg === 'Sign In Is Successful!') {
            self.setToken(res3.token);
            self.toastrService.success(res3.msg, 'Welcome!');
            self.router.navigateByUrl('/content/list');
          }
        });
      })
      .catch(this.handleError);
    });
  }

  authGoogle(authResponse): Observable<any> {
    const self = this;
    return this.http.post<any>(environment.apiUrl + 'auth/google', authResponse).pipe(
      catchError(self.handleError('authGoogle', []))
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
    return this.http.post<any>(environment.apiUrl + 'userData', userDataColumns);
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
  modifyNotification (notificationId,username, isRead:boolean): any {
    let self = this;
    return this.http.patch( environment.apiUrl + 'modifyNotification/' + notificationId, {isRead: isRead}).pipe(
      catchError(self.handleError('modifyNotification', []))
    )
  }
  

  public handleError<T>(operation = 'operation', result?: T) {
    const self = this;
    return function (error: any): Observable<T> {
      if (
        operation === 'signUp' ||
        operation === 'verifyEmail' ||
        operation === 'signIn' ||
        operation === 'authFacebook' ||
        operation === 'authGoogle' ||
        operation === 'childsignup' ||
        operation === 'verifyChildEmail' ||
        operation === 'forgotPassword' ||
        operation === 'resetPassword' ||
        operation === 'modifyNotification'
      ) {
        self.toastrService.error(error.error.msg);
      }
      return of(result as T);
    };
  }

}
