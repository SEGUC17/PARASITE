import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class MessageService {

  // url: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }


  // making a POST request to send a message
  send(message: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + 'message/sendMessage', message, httpOptions);
  }

  // making a GET request to get inbox
  getInbox(user: any): Observable<any> {
    return this.http.get<any>(environment.apiUrl + 'message/inbox/' + user);
  }

  // making a GET request to get sent messages
  getSent(user: any): Observable<any> {
    return this.http.get<any>(environment.apiUrl + 'message/sent/' + user);
  }

  // making a DELETE request to delete a specific message (using the message id)
  deleteMessage(message: any): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + `message/${message._id}`, httpOptions);
  }

  block(blocked: any, user: any): Observable<any> {
      const self = this;
       return this.http.patch(environment.apiUrl + `message/block/${blocked}`, user, httpOptions);
   }

   getContacts(user: any): Observable<any> {
    return this.http.get<any>(environment.apiUrl + 'message/contacts/' + user);
  }

}
