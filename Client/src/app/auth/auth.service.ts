import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }
  endpoint: String = 'http://localhost:3000/api/'
  user: any = {};

  signUp(user: any): Observable<any>{
    // console.log(user);
    // this.signUp(user).subscribe(function(res){});
    return this.http.post<any>("http://localhost:3000/api/signup",user, { 'withCredentials': true });
          
  }//end method


  Login(user: any) : Observable<any>{
    // console.log(user);
    // this.Login(user).subscribe(function(res){});
    return this.http.post<any>("http://localhost:3000/api/signin", user, { 'withCredentials': true });

    }//end method
  setUser(user: any): void {
    this.user = user;
  }
  getUser(): any {
    return this.user;
  }
}//end class