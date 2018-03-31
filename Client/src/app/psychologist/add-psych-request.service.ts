import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddPsychologistRequest } from './add-psych-request/AddPsychologistRequest'
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

var host = 'http://localhost:3000/api';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AddPsychRequestService {

	private addReqUrl = host + '/psychologist/request/add/addRequest';

  constructor(private http: HttpClient) {  }

  addRequest(req: AddPsychologistRequest): Observable<any> {
		
		console.log(req);
		return this.http.post<any>(this.addReqUrl, req, httpOptions);
	}

}
