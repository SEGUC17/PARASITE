import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../messaging/messaging.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = environment.apiUrl;

@Injectable()

export class ProfileService {
  // ------------- Profile Page Method(s) -------------- AUTHOR:
  constructor(private http: HttpClient, private authService: AuthService,
 private toastrService: ToastrService, private messageService: MessageService) { }
  UserData = ['username'];
  private linkAnotherParentUrl = apiUrl + 'profile/LinkAnotherParent';
  private UnlinkUrl = apiUrl + 'profile/UnLinkChild';
  private linkAsParentUrl = apiUrl + 'profile/AddAsAParent';
  private getChildrenUrl = apiUrl + 'profile/';
  private continueUrl = 'getChildren';
  private pwURL = apiUrl + 'profile/changePassword';
  private profileUrl = apiUrl + 'profile';
  private changeChildInfoUrl = apiUrl + 'profile/changeChildInfo';
  private changeInfoUrl = apiUrl + 'profile/ChangeInfo';
  private reportUserUrl = apiUrl + 'profile/ReportUser';
  // private editeInfoUrl = 'http://localhost:3000/api/profile/editInfo';

  // Author: Yomna
  linkAnotherParent(children, vId): Observable<any> {
    return this.http.put<any>(`${this.linkAnotherParentUrl}/${vId}`, children, httpOptions);
  }


  Unlink(childrenList, Id): Observable<any> {
    return this.http.put<any>(`${this.UnlinkUrl}/${Id}`, childrenList, httpOptions);

  }


  linkAsParent(child, vId): Observable<any> {
    return this.http.put<any>(`${this.linkAsParentUrl}/${vId}`, child, httpOptions);
  }
  // ------------------------------------------------------------------------


  /*
      @author: MAHER.
   */
  makeContributerValidationRequest(requestObj): any {
    let self = this;
    return this.http.post(this.profileUrl + '/VerifiedContributerRequest', { obj: {} });
  }


  // author: Heidi
  getChildren(username): any {
    console.log(username);
    return this.http.get(this.getChildrenUrl + username + '/getChildren');
  }

  // Author: Nehal
  changePassword(id, info): Observable<any> {
    // console.log(oldpw);
    return this.http.patch<any>(`${this.pwURL}/${id}`, info, httpOptions);

  }
  // author :Heidi
  EditChildIndependence(visitedChildUsername): any {
    // adding username of the visited child to the patch request
    return this.http.patch(apiUrl + 'profile/' + visitedChildUsername + '/EditChildIndependence', null);
  }
  ChangeInfo(Id, info): Observable<any> {
    return this.http.patch<any>(`${this.changeInfoUrl}/${Id}`, info, httpOptions);
  }

  changeChildinfo(info): any {
    return this.http.patch(apiUrl + 'profile/changeChildInfo', info);
  }
  // Author: Heidi
  UnlinkMyself(visitedParentUsername): any {
    // adding username of the visited parent to the patch request
    return this.http.patch('http://localhost:3000/api/profile/' + visitedParentUsername + '/UnlinkMyself', null);
  }

  reportUser(report, Id): any {
    return this.http.post(this.reportUserUrl, report, httpOptions);
  }

}
