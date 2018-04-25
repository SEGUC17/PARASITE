import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { apiUrl } from '../../variables';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ProductRequestsService {

  // The URLS for the backend api
  private getterUrl =  apiUrl + 'productrequest/getRequests';
  private evalUrl =  apiUrl + 'productrequest/evaluateRequest';

  constructor(private http: HttpClient) { }

  // Sending the GET request for the products requests
  getProductRequests(): Observable<any> {
    return this.http.get<any>(this.getterUrl);
  }

  // Sending the POST request with the evaluation of product request
  evalRequest(productReq: any): Observable<any> {
    return this.http.post<any>(this.evalUrl, productReq, httpOptions);
  }

}
