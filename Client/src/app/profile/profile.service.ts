import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import { AuthService } from '../auth/auth.service';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()

export class ProfileService {
// ------------- Profile Page Method(s) -------------- AUTHOR: H
constructor(private http: HttpClient, private authService: AuthService) { }


private Url = 'http://localhost:3000/api/profile';
getUserInfo(username: String): Observable<any> {
    return this.http.get(`${this.Url}/${username}`);
  }


private linkAnotherParentUrl = 'http://localhost:3000/api/profile/LinkAnotherParent';
linkAnotherParent(children, vId): Observable<any> {
  return this.http.put<any>(`${this.linkAnotherParentUrl}/${vId}`, children, httpOptions);

// why is it put not patch
}


private UnlinkUrl = 'http://localhost:3000/api/profile/Unlink/';

Unlink(childrenList, Id): Observable<any> {
  return this.http.patch<any>(`${this.UnlinkUrl}/${Id}`, childrenList, httpOptions);

}


private linkAsParentUrl = 'http://localhost:3000/api/profile/LinkAsParent/';
linkAsParent (child, vId): Observable<any> {
return this.http.patch<any>(`${this.linkAsParentUrl}/${vId}`, child, httpOptions);
}
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------


/*
    @author: MAHER.
 */
  makeContributerValidationRequest(requestObj): any {
    let self = this;
    return this.http.post(
      this.Url + '/VerifiedContributerRequest',
      { obj: {} })
      .subscribe();
  }


  changePassword(oldpw, newpw): Observable<any> {
    return this.http.patch<any> (oldpw, newpw);

  }
  private getChildrenUrl = 'http://localhost:3000/api/profile';
  continueUrl = 'getChildren';
  getChildren(): any {
        let username = this.authService.getUser().username;
        return this.http.get(`${this.getChildrenUrl}/${username}/${this.continueUrl}`);
       }



}
