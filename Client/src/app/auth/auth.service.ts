import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }
  endpoint: String = 'http://localhost:3000/api/childsignup';
  user: any = {};
  authHeader: Headers = new Headers();

  signUp(user: any): Observable<any> { // console.log(user);
    // this.signUp(user).subscribe(function(res){});
    return this.http.post<any>('http://localhost:3000/api/signup', user);
  }// end method


  Login(user: any): Observable<any> {
    // console.log(user);
    // this.Login(user).subscribe(function(res){});
    return this.http.post<any>('http://localhost:3000/api/signin' ,  user);

    }// end method
  setUser(user: any): void {
    this.user = user;
  }
  getUser(): any {
    return this.user;
  }

  childSignUp(user: any, userID: any ): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/${userID}` , user);
  }
}// end class
