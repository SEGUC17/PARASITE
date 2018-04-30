import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StudyPlan } from './study-plan';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { RequestOptions, Headers } from '@angular/http';
import { Options } from 'selenium-webdriver';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs/observable/of';

@Injectable()
export class StudyPlanService {
  private baseURL = environment.apiUrl;
  private removePublishedStudyPlansURL = 'admin/removePublishedStudyPlan/';

  constructor(private http: HttpClient, private toasterService: ToastrService) { }

  // general error handler
  private handleError<T>(operation = 'operation', result?: T) {
    const self = this;
    return function (error: any): Observable<T> {
      if (error.error.msg) {
        self.toasterService.error(error.error.msg, operation + ' failed');
      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getPersonalStudyPlan(username: String, studyPlanID: String): Observable<any> {
    return this.http.get(environment.apiUrl + 'study-plan/getPersonalStudyPlan/' + username + '/' + studyPlanID);
  }

  getPublishedStudyPlan(studyPlanID: String): Observable<any> {
    return this.http.get(environment.apiUrl + 'study-plan/getPublishedStudyPlan/' + studyPlanID);
  }

  createStudyPlan(studyPlan: StudyPlan): Observable<any> {
    return this.http.patch(environment.apiUrl + 'study-plan/createStudyPlan', studyPlan);
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

  // moved to profile
  // deleteStudyPlan(studyPlanID: String): Observable<any> {
  //   return this.http.delete(environment.apiUrl + 'study-plan/deleteStudyPlan/' + studyPlanID);

  // }

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

  editPublishedStudyPlan(studyPlanID: String, studyPlan: StudyPlan): Observable<any> {
    return this.http.patch(environment.apiUrl + '/study-plan/editPublishedStudyPlan/' + studyPlanID, studyPlan);
  }

  removePublishedStudyPlans(studyPlanId: any): Observable<any> {
    const self = this;
    return this.http.get(self.baseURL + self.removePublishedStudyPlansURL + studyPlanId)
      .pipe(
        catchError(
          self.handleError('removePublishedStudyPlan', [])
        )
      );
  }
}
