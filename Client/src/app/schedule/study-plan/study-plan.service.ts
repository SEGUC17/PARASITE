import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StudyPlan } from './study-plan';
import { Rating } from './star-rating/rating';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { RequestOptions, Headers} from '@angular/http';
import { Options } from 'selenium-webdriver';

@Injectable()
export class StudyPlanService {

  endpoint: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

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
    /*
    @author: Ola
    get all publishedStudyPlans (study plans schema in the database) page by page by passing
    page number to the controller which handles pagination
    */
    return this.http.get(this.endpoint + 'study-plan/getPublishedStudyPlans/' + pageNumber);
  }

  PublishStudyPlan(studyPlan: StudyPlan): Observable<any> {
    /*
    @author: Ola
    post request with the required studyPlan to be published in the body of the request with the route specified in the index.js
    */
    return this.http.post(this.endpoint + 'study-plan/PublishStudyPlan', studyPlan);

  }

  rateStudyPlan(studyPlanID: String, rating: Number): Observable<any> {
    return this.http.patch(this.endpoint + 'study-plan/rateStudyPlan/' + studyPlanID + '/' + rating, {});
  }

  deleteStudyPlan(username: String, studyPlanID: String): Observable<any> {
    return this.http.delete(this.endpoint + 'study-plan/deleteStudyPlan/' + username + '/' + studyPlanID);

  }

  deletePublishedStudyPlan(studyPlanID: String): Observable<any> {
    return this.http.delete(this.endpoint + 'study-plan/deletePublishedStudyPlan/' + studyPlanID);

  }
}
