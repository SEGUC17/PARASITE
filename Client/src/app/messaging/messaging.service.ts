import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class MessageService {

  url: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  send(message: any): Observable<any> {
    return this.http.post<any>(this.url + 'message/sendMessage', message, httpOptions);
  }

  getInbox(user: any): Observable<any> {
    return this.http.get<any>(this.url + 'message/inbox/' + user);
  }

  getSent(user: any): Observable<any> {
    return this.http.get<any>(this.url + 'message/sent/' + user);
  }

  deleteMessage(message: any): Observable<any> {
    return this.http.delete<any>(this.url + `message/${message._id}`, httpOptions);
  }



}
