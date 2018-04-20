import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
@Injectable()
export class SearchService {
  private Url = 'http://localhost:3000/';
  constructor(private http: HttpClient) { }
// searching for parents with the specified tags
  getParents(tags: string[] , currPage: any , numberPerPage: any ): Observable<any> {

    return this.http.get<any>(`${this.Url}api/User/Search/` + tags[0] + '/' + tags[1] + '/'  + tags[2] + '/'  + tags[3]
     + '/' + currPage + '/' + numberPerPage );
  }
// viewing the profile clicked on
  viewProfile(term: string): Observable<any> {
    if (!term.trim()) {
      return of([]);
      }
    return this.http.get<any>(`${this.Url}api/profile/` + term);
  }
}
