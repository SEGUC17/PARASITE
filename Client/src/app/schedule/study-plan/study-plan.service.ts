import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class StudyPlanService {

  endpoint: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

}
