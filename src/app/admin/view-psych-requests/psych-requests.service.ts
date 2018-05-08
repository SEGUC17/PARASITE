import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PsychRequestsService {

  private getterUrl = environment.apiUrl + 'psychologist/request/getRequests';
  private evalUrl = environment.apiUrl + 'psychologist/request/evalRequest';

  constructor(private http: HttpClient, private translate: TranslateService) { }

  // Sending GET requests for the psychologist requests
  getPsychRequests(): Observable<any> {
    return this.http.get<any>(this.getterUrl);
  }

  // Sending the POST requests for the evaluation of a request
  evalRequest(psychReq: any): Observable<any> {
    return this.http.post<any>(this.evalUrl, psychReq, httpOptions).pipe(
      catchError(this.handleError('evalRequest', '404 Not Found'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      console.error(error);
      return of(result as T);
    };
  }

}
