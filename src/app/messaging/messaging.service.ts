import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class MessageService {
  private static message: any;
  url: String = environment.apiUrl;

  constructor(private http: HttpClient, private toastrService: ToastrService) { }


  // making a POST request to send a message
  send(message: any): Observable<any> {
    return this.http.post<any>(this.url + 'message/sendMessage', message, httpOptions);
  }

  // making a GET request to get inbox
  getInbox(user: any): Observable<any> {
    return this.http.get<any>(this.url + 'message/inbox/' + user);
  }

  // making a GET request to get sent messages
  getSent(user: any): Observable<any> {
    return this.http.get<any>(this.url + 'message/sent/' + user);
  }

  // making a DELETE request to delete a specific message (using the message id)
  deleteMessage(message: any): Observable<any> {
    return this.http.delete<any>(this.url + `message/${message._id}`, httpOptions);
  }

  block(blocked: any, user: any): Observable<any> {
      const self = this;
       return this.http.patch(this.url + `message/block/${blocked}`, user, httpOptions);
   }

   getContacts(user: any): Observable<any> {
    return this.http.get<any>(this.url + 'message/contacts/' + user);
  }
// making a POST  request to send a message to admins
  contactus(toSend: any): Observable<any> {
        return this.http.post<any>(this.url + 'message/contactus', toSend, httpOptions);

  }

 setMessage(msg: any): void {
   MessageService.message = msg;
 }

 getMessage(): any {
   return MessageService.message;
 }

  unBLock(userId: any, list: any):  Observable<any> {
    return this.http.patch(this.url + `message/unblock/${userId}`, list, httpOptions);
  }

  read(message): Observable<any> {
    return this.http.patch(this.url + 'message/read', message, httpOptions);
  }
}
