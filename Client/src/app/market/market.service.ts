import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class MarketService {
  host: String = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) { }
  getMarketPage(entriesPerPage: number, pageNumber: number, limiters: any): Observable<any> {
    return this.http.get(this.host + 'market/getMarketPage/' + entriesPerPage +
      '/' + pageNumber,limiters)
      .pipe(
        catchError(this.handleError('getMarketPage', []))
      );
  }
  numberOfMarketPages(entriesPerPage: number, limiters: any): Observable<any> {
    return this.http.get(this.host + 'market/numberOfMarketPages/' +
       entriesPerPage, limiters)
      .pipe(
        catchError(this.handleError('getNumberOfMarketPages', []))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      console.error(error);
      return of(result as T);
    };
  }
}
