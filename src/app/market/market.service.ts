import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MarketService {

  host: String = environment.apiUrl;

  constructor(private http: HttpClient, private toasterService: ToastrService) { }

  // gets the products in a page (pageNumber)
  // restrict the products to the ones following the delimiters given
  getMarketPage(entriesPerPage: number, pageNumber: number, limiters: any): Observable<any> {
    let url = this.host + 'market/getMarketPage/' + entriesPerPage +
      '/' + pageNumber + '/' + JSON.stringify(limiters);
    return this.http.get(url);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      return of(result as T);
    };
  }

  // Post a product
  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.host + 'productrequest/createproduct', product, httpOptions);
  }
  // Post a product request
  createProductRequest(request: any): Observable<any> {
    return this.http.post<any>(this.host + 'productrequest/createProductRequest', request, httpOptions);
  }

  // Get user unverified requests
  getUserRequests(username: String): Observable<any> {
    return this.http.get<any>(this.host + 'productrequest/getUserRequests/' + username, httpOptions);
  }

  // Edit the price of one of the users Products
  editPrice(product: any, username: String): Observable<any> {
    return this.http.patch<any>(this.host + 'productrequest/editPrice/' + product._id + '/' + username, product, httpOptions);
  }

  // Delete one of the products on Marketplace
  deleteProduct(req: any): Observable<any> {
    return this.http.patch<any>(this.host + 'productrequest/deleteProduct', req, httpOptions);
  }

  // Send updated request to Database
  updateRequest(updatedReq: any, _id: String, username: String): Observable<any> {
    return this.http.patch<any>(this.host + 'productrequest/updateProdRequest/' + _id + '/' + username, updatedReq, httpOptions);
  }
}
