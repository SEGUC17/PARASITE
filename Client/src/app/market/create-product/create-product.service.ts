import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CreateProductService { //create product, sendrequest

    constructor(private http:HttpClient) { }

createProduct(product: any): Observable<any> {
        return this.http.post<any>("http://localhost:3000/api/productrequest/createproduct",product, httpOptions);
      }
createProductRequest(request: any): Observable<any> {
        return this.http.post<any>("http://localhost:3000/api/productrequest/createProductRequest",request, httpOptions);
      }
      
    
      }