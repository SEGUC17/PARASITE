import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()

export class ProfileService {
    
// TODO: Write Profile Service AUTHOR: Maher


//-------------- Profile Page Method(s) -------------- AUTHOR: H
    constructor(private http: HttpClient) { }

    private Url = '/profile/';
    getUserInfo(product, newProduct): Observable<any> {
        return this.http.get(`${this.Url}/${product._id}`);
      }

}
