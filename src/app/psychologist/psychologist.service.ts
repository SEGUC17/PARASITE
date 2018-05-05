import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PsychologistRequest } from './PsychologistRequest';
import { Psychologist } from './psychologist/psychologist';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
@Injectable()
export class PsychologistService {
  host: String = environment.apiUrl;
  constructor(private http: HttpClient) { }
  addRequest(req: PsychologistRequest): Observable<any> {
    return this.http.post<any>(this.host + 'psychologist/request/add/addRequest', req, httpOptions);
  }
  editRequest(req: PsychologistRequest): Observable<any> {
    return this.http.post<any>(this.host + 'psychologist/request/edit', req, httpOptions);
  }
  deletePsychologist(id: String): Observable<any> {
    const url = this.host + 'psychologist/delete/' + id;
    return this.http.delete<any>(url, httpOptions);
  }
  getPsychologists(limiters: string): Observable<any> {
    return this.http.get<any>(this.host + 'psychologist/search/' + limiters).pipe(
      catchError(this.handleError('getPsychologists', []))
    );
  }
  editPsychologists(psychologist: any) {
    return this.http.post<any>(this.host + 'psychologist/editPsych', psychologist, httpOptions);

  }


  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      console.error(error);
      return of(result as T);
    };
  }

  getPsychologistData(ID: String) {
    return this.http.get<any>(this.host + 'psychologist/' + ID).pipe(
      catchError(this.handleError('getPsychologists', []))
    );
  }


}
