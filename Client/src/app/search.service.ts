import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class SearchService {
  private Url = 'http://localhost:3000/';
  constructor(private http: HttpClient) { }

  getParents(): Observable<any> {
    return this.http.get<any>(`${this.Url}api/User/Search`); 
}
}
