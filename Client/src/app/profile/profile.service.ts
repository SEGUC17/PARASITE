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

private linkAnotherParentUrl = 'http://localhost:3000/api/profile/LinkAnotherParent';
private UnlinkUrl = 'http://localhost:3000/api/profile/UnLinkChild/';
private linkAsParentUrl = 'http://localhost:3000/api/profile/AddAsAParent/';
private getChildrenUrl = 'http://localhost:3000/api/profile';
private continueUrl = 'getChildren';
private pwURL = 'http://localhost:3000/api/profile/changePassword';
private profileUrl = 'http://localhost:3000/api/profile';

// Author: Yomna
linkAnotherParent(children, vId): Observable<any> {
  return this.http.put<any>(`${this.linkAnotherParentUrl}/${vId}`, children, httpOptions);
}


Unlink(childrenList, Id): Observable<any> {
  return this.http.patch<any>(`${this.UnlinkUrl}/${Id}`, childrenList, httpOptions);

}


linkAsParent (child, vId): Observable<any> {
return this.http.patch<any>(`${this.linkAsParentUrl}/${vId}`, child, httpOptions);
}
// ------------------------------------------------------------------------


/*
    @author: MAHER.
 */
  makeContributerValidationRequest(requestObj): any {
    let self = this;
    return this.http.post(
      this.profileUrl + '/VerifiedContributerRequest',
      { obj: {} })
      .subscribe();
  }


  // Author: Heidi
  getChildren(username): any {
        return this.http.get(`${this.getChildrenUrl}/${username}/${this.continueUrl}`);
       }

  // Author: Nehal
  changePassword(id, pws): Observable<any> {
        // console.log(oldpw);
        return this.http.patch<any> (`${this.pwURL}/${id}`, pws, httpOptions);

    }


}
