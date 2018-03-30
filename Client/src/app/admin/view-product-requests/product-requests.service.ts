import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const baseLink = 'http://localhost:3000/';

@Injectable()
export class ProductRequestsService {

  products: Array<any>;

  private getterUrl =  baseLink + 'api/productrequest/getRequests';
  private evalUrl =  baseLink + 'api/productrequest/evaluateRequest';

  constructor(private http: HttpClient) { }

  getProductRequests(): Observable<any> {
    return this.http.get<any>(this.getterUrl);
  }

  evalRequest(productReq: any): Observable<any> {
    console.log('Got here');
    return this.http.post<any>(this.evalUrl, productReq, httpOptions);
  }

}
