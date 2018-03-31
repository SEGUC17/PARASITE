import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpModule } from '@angular/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class MessageService {

  constructor(private http: HttpClient) { }

  //private URL = 'http://localhost:3000/api/';

  send(message: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/message/sendMessage', message, httpOptions);
  }

}