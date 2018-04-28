import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Category } from './content/category';
import { ToastrService } from 'ngx-toastr';
import { Section } from './content/section';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()


export class AdminService {
  private baseURL = 'http://localhost:3000/api/';
  private removePublishedStudyPlansURL = 'admin/removePublishedStudyPlan/';
  private viewPendingStudyPlanPublishReqsURL = 'admin/PendingStudyPlanPublishRequests';
  private respondStudyPlanPublishRequestURL = 'admin/RespondStudyPlanPublishRequest/';
  private viewPendingContReqsURL = 'admin/PendingContentRequests/';
  private respondContentRequestURL = 'admin/RespondContentRequest/';
  private respondContentStatusURL = 'admin/RespondContentStatus/';
  private getContent = 'admin/getContent/';
  private URL = 'http://localhost:3000/api/admin/';
  private addContributionPtsURL = 'admin/addContPts';
  private reportUrl = '/getReports';


  constructor(private http: HttpClient, private toasterService: ToastrService) {
  }

  respondToContributerValidationRequest(id, resp): any {
    /*
      @author: MAHER.
      respond the requests.
   */
    console.log('the Responce is sent el mafrood AUTHOR: Maher');
    return this.http.patch(
      this.URL + 'VerifiedContributerRequestRespond/' + id,
      { responce: resp }
    ).subscribe();
  }

  viewPendingVCR(FilterBy): any {
    /*
      @author: MAHER.
      gets the requests.
   */
    return this.http.get(this.URL + 'VerifiedContributerRequests/' + FilterBy);
  }

  viewPendingContReqs(res, idea, create, edit): any {
    const self = this;
    return this.http.get<any>(this.baseURL + this.viewPendingContReqsURL + res + '/' + idea + '/'  + create + '/' + edit)
      .pipe(
        catchError(
          self.handleError('viewPendingContReqs', [])
        )
      );
  }

  respondContentRequest(response, rid, cid, cresponse, username, oldscore): any {
    const self = this;
    return this.http.patch<any>(this.baseURL + this.respondContentRequestURL + rid + '/' + cid,
      { str: response, approved: cresponse, userName: username, oldScore: oldscore })
      .pipe(
        catchError(
          self.handleError('respondContentRequest', [])
        )
      );
  }
  getcontent(): any {
    const self = this;
    return this.http.get<any>(this.baseURL + this.getContent)
      .pipe(
        catchError(
          self.handleError('getContent', [])
        )
      );
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
  viewStudyPlanPublishReqs(): Observable<any> {
    const self = this;
    return this.http.get(self.baseURL + self.viewPendingStudyPlanPublishReqsURL)
      .pipe(
        catchError(
          self.handleError('viewStudyPlanPublishReqs', [])
        )
      );
  }
  respondStudyPlanPublishReqs(respo, id, sid): Observable<any> {
    const self = this;
    return this.http.patch<any>(self.baseURL + self.respondStudyPlanPublishRequestURL + id + '/' + sid, respo)
      .pipe(
        catchError(
          self.handleError('respondContentRequest', [])
        )
      );
  }
  // create a category for content (resrouces and ideas) to be classified into
  createCategory(category: Category): Observable<any> {
    const self = this;
    return this.http.post(self.baseURL + 'content/category', category)
      .pipe(
        catchError(
          self.handleError('create category')
        )
      );
  }

  // update a category

  updateCategory(category: Category): Observable<any> {
    const self = this;
    return this.http.patch(self.baseURL + 'content/category/' + category._id,
      {
        name: category.name,
        iconLink: category.iconLink
      }).pipe(
        catchError(self.handleError('update category'))
      );
  }

  // Delete Category

  deleteCategory(category: any): Observable<any> {
    const self = this;
    return this.http.delete(self.baseURL + 'content/category/' + category._id)
      .pipe(
        catchError(
          self.handleError('Delete Category')
        )
      );
  }

  // create a section for content (resources and ideas) to be classified into
  createSection(categoryId: any, section: any): Observable<any> {
    const self = this;
    return this.http.post(self.baseURL + 'content/category/' + categoryId + '/section', section)
      .pipe(
        catchError(
          self.handleError('createSection', [])
        )
      );
  }

  // Update section
  updateSection(categoryId: any, section: Section): Observable<any> {
    const self = this;
    return this.http.patch(
      self.baseURL + 'content/category/' + categoryId +
      '/section/' + section._id,
      { iconLink: section.iconLink, sectionName: section.name })
      .pipe(
        catchError(self.handleError('Update Section'))
      );
  }

  // Delete section
  deleteSection(categoryId: any, sectionId: any): Observable<any> {
    const self = this;
    return this.http.delete(self.baseURL + 'content/category/' + categoryId + '/section/' + sectionId)
      .pipe(
        catchError(
          self.handleError('Delete Section', [])
        )
      );
  }

  // TO-DO ContributionPts
  // addContPts(userName: any ): any {
  //   const self = this;
  //   return this.http.patch<any>(self.baseURL + self.addContributionPtsURL , { username: userName })
  //   .pipe(
  //     catchError(
  //       self.handleError('AddContributionPts', [])
  //     )
  //   );
  // }

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
  // Getting the user reports.
  getReports(): any {
    const self = this;
    return this.http.get<any>(this.URL + this.reportUrl, httpOptions);

  }
}
