import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MarketService {

  host: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  // gets the products in a page (pageNumber)
  // restrict the products to the ones following the delimiters given
  getMarketPage(entriesPerPage: number, pageNumber: number, limiters: any): Observable<any> {
    console.log(JSON.stringify(limiters));
    let url = this.host + 'market/getMarketPage/' + entriesPerPage +
      '/' + pageNumber + '/' + JSON.stringify(limiters);
    return this.http.get(url).pipe(
      catchError(this.handleError('getMarketPage', []))
    );
  }
  // gets the total number of products
  // restrict the products to the ones following the delimiters given
  numberOfMarketPages(limiters: any): Observable<any> {
    console.log(JSON.stringify(limiters));
    let url = this.host + 'market/getNumberOfProducts/' + JSON.stringify(limiters);
    return this.http.get(url).pipe(
      catchError(this.handleError('getNumberOfProducts', []))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      console.error(error);
      return of(result as T);
    };
  }

  //Post a product
  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.host + 'productrequest/createproduct', product, httpOptions);
  }
  //Post a product request
  createProductRequest(request: any): Observable<any> {
    return this.http.post<any>(this.host + 'productrequest/createProductRequest', request, httpOptions);
  }
}
