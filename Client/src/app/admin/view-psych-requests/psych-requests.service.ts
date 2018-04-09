import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { apiUrl } from '../../variables';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PsychRequestsService {

  private getterUrl = apiUrl + 'psychologist/request/getRequests';
  private evalUrl = apiUrl + 'psychologist/request/evalRequest';

  constructor(private http: HttpClient) { }

  // Sending GET requests for the psychologist requests
  getPsychRequests(): Observable<any> {
    return this.http.get<any>(this.getterUrl);
  }

  // Sending the POST requests for the evaluation of a request
  evalRequest(psychReq: any): Observable<any> {
    return this.http.post<any>(this.evalUrl, psychReq, httpOptions);
  }

}
