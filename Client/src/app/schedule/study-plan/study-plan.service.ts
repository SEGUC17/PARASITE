import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StudyPlan } from './study-plan';
import { Rating } from './star-rating/rating';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Injectable()
export class StudyPlanService {

  endpoint: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getPersonalStudyPlans(username: String): Observable<any> {
    return this.http.get(this.endpoint + 'study-plan/getPersonalStudyPlans/' + username);
  }

  getPersonalStudyPlan(username: String, studyPlanID: String): Observable<any> {
    return this.http.get(this.endpoint + 'study-plan/getPersonalStudyPlan/' + username + '/' + studyPlanID);
  }

  getPublishedStudyPlan(studyPlanID: String): Observable<any> {
    return this.http.get(this.endpoint + 'study-plan/getPublishedStudyPlan/' + studyPlanID);
  }

  createStudyPlan(username: String, studyPlan: StudyPlan): Observable<any> {
    return this.http.patch(this.endpoint + 'study-plan/createStudyPlan/' + username, studyPlan);
  }

  getPublishedStudyPlans(pageNumber: Number): Observable<any> {
    return this.http.get(this.endpoint + 'study-plan/getPublishedStudyPlans/' + pageNumber);
  }

  PublishStudyPlan(studyPlan: StudyPlan): Observable<any> {
    return this.http.post(this.endpoint + 'study-plan/PublishStudyPlan', studyPlan);

  }

  rateStudyPlan(studyPlanID: String, rating: Number): Observable<any> {
    return this.http.patch(this.endpoint + '/study-plan/rateStudyPlan/' + studyPlanID + '/' + rating, {});
  }
}
