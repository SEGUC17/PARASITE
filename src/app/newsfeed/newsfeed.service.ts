import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class NewsfeedService {
  host: String = environment.apiUrl;
  constructor(private http: HttpClient) { }
  getNewsfeedPage(tags: any[], entriesPerPage: number, pageNumber: number):  Observable<any> {
    return this.http.patch<any>(this.host + 'newsfeed/' + entriesPerPage + '/' + pageNumber , {tags}, httpOptions);

  }
  getPeople(): Observable<any> {
    return this.http.get<any>(this.host + 'newsfeed/findPeople');
  }
  deleteInterest(interestText): any {
    return this.http.delete<any>(this.host + 'newsfeed/delete/' + interestText);
  }
  addInterest(interestText): any {
    return this.http.patch<any>(this.host+'newsfeed/addInterest', {text: interestText});
  }
  getTags(): any {
    return this.http.get<any> (this.host + 'tags/getTags');
  }
}
