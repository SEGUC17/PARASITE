import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class MessageService {

  constructor(private http: HttpClient) { }

  send(message: any): Observable<any> {
    return this.http.post<any>("http://localhost:3000/api/message/sendMessage", message, httpOptions);
  }

}