import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StudyPlan } from './study-plan';
import { Router } from '@angular/router';

@Injectable()
export class StudyPlanService {

  endpoint: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getPerosnalStudyPlans(username: String): Observable<any> {
    return this.http.get(this.endpoint + 'study-plan/getPerosnalStudyPlans/' + username);
  }

  getPersonalStudyPlan(username: String, studyPlanID: String): Observable<any> {
    return this.http.get(this.endpoint + 'study-plan/getPerosnalStudyPlan/' + username + '/' + studyPlanID);
  }

  getPublishedStudyPlan(studyPlanID: String): Observable<any> {
    return this.http.get(this.endpoint + 'study-plan/getPublishedStudyPlan/' + studyPlanID);
  }

  createStudyPlan(username: String, studyPlan: StudyPlan): Observable<any> {
    return this.http.patch(this.endpoint + 'study-plan/createStudyPlan/' + username, studyPlan);
  }

  getPublishedStudyPlans(): Observable<any> {
    return this.http.get(this.endpoint + 'study-plan/getPublishedStudyPlans ');
  }

  PublishStudyPlan(studyPlan: StudyPlan): Observable<any> {
    return this.http.post(this.endpoint + 'study-plan/PublishStudyPlan', studyPlan);

  }
}
