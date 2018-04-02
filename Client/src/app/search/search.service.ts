import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
@Injectable()
export class SearchService {
  private Url = 'http://localhost:3000/';
  constructor(private http: HttpClient) { }

  getParents(term: string): Observable<any> {
    if (!term.trim()) {
    return of([]);
    }
    return this.http.get<any>(`${this.Url}api/User/Search/` + term);
}
  searchByEducationLevel(term: string): Observable<any> {
    if (!term.trim()) {
    return of([]);
    }
    return this.http.get<any>(`${this.Url}api/User/FilterByLevelOfEducation/` + term );
  }
  searchByEducationSystems(term: string): Observable<any> {
    if (!term.trim()) {
    return of([]);
    }
    return this.http.get<any>(`${this.Url}api/User/FilterBySystemOfEducation/` + term);
  }
  viewProfile(term: string): Observable<any> {
    if (!term.trim()) {
      return of([]);
      }
    return this.http.get<any>(`${this.Url}api/profile/` + term);
  }
  getNumberOfPages(NPP: any): Observable<any> {
    return this.http.get(`${this.Url}api/User/NumberOfPages/` + NPP);
  }
  getPage(page: number): Observable<any> {
    return this.http.get<any>(`${this.Url}api/User/page/` + page);
  }
}
