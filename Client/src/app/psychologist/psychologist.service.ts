import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddPsychologistRequest } from './add-psych-request/AddPsychologistRequest';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
@Injectable()
export class PsychologistService {
  host: String = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }
  addRequest(req: AddPsychologistRequest): Observable<any> {
    console.log(req);
    return this.http.post<any>(this.host + '/psychologist/request/add/addRequest', req, httpOptions);
  }
  getPsychologists(): Observable<any> {
    return this.http.get<any>(this.host + '/psychologist').pipe(
      catchError(this.handleError('getPsychologists', []))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      console.error(error);
      return of(result as T);
    };
  }


}
