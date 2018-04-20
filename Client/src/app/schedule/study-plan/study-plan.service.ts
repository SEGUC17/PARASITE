import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StudyPlan } from './study-plan';
import { Rating } from './star-rating/rating';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { RequestOptions, Headers } from '@angular/http';
import { Options } from 'selenium-webdriver';
import { environment } from '../../../environments/environment';

@Injectable()
export class StudyPlanService {


  constructor(private http: HttpClient) { }

  getPersonalStudyPlan(username: String, studyPlanID: String): Observable<any> {
    return this.http.get(environment.apiUrl + 'study-plan/getPersonalStudyPlan/' + username + '/' + studyPlanID);
  }

  getPublishedStudyPlan(studyPlanID: String): Observable<any> {
    return this.http.get(environment.apiUrl + 'study-plan/getPublishedStudyPlan/' + studyPlanID);
  }

  createStudyPlan(username: String, studyPlan: StudyPlan): Observable<any> {
    return this.http.patch(environment.apiUrl + 'study-plan/createStudyPlan/' + username, studyPlan);
  }

  getPublishedStudyPlans(pageNumber: Number): Observable<any> {
    /*
    @author: Ola
    get all publishedStudyPlans (study plans schema in the database) page by page by passing
    page number to the controller which handles pagination
    */
    return this.http.get(environment.apiUrl + 'study-plan/getPublishedStudyPlans/' + pageNumber);
  }

  PublishStudyPlan(studyPlan: StudyPlan): Observable<any> {
    /*
    @author: Ola
    post request with the required studyPlan to be published in the body of the request with the route specified in the index.js
    */
    return this.http.post(environment.apiUrl + 'study-plan/PublishStudyPlan', studyPlan);

  }

  rateStudyPlan(studyPlanID: String, rating: Number): Observable<any> {
    return this.http.patch(environment.apiUrl + 'study-plan/rateStudyPlan/' + studyPlanID + '/' + rating, {});
  }

  deleteStudyPlan(username: String, studyPlanID: String): Observable<any> {
    return this.http.delete(environment.apiUrl + 'study-plan/deleteStudyPlan/' + username + '/' + studyPlanID);

  }

  deletePublishedStudyPlan(studyPlanID: String): Observable<any> {
    return this.http.delete(environment.apiUrl + 'study-plan/deletePublishedStudyPlan/' + studyPlanID);

  }

  assignStudyPlan(username: String, studyPlanID: String): Observable<any> {

    return this.http.patch(environment.apiUrl + 'study-plan/assignStudyPlan/' + username + '/' + studyPlanID, {});

  }

  unAssignStudyPlan(username: String, studyPlanID: String): Observable<any> {

    return this.http.patch(environment.apiUrl + 'study-plan/unAssignStudyPlan/' + username + '/' + studyPlanID, {});

  }

  editPersonalStudyPlan(username: String, studyPlanID: String, studyPlan: StudyPlan): Observable<any> {
    return this.http.patch(environment.apiUrl + '/study-plan/editPersonalStudyPlan/' + username + '/' + studyPlanID, studyPlan);
  }
}
