import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { StudyPlan } from '../study-plan';
import { StudyPlanService } from '../study-plan.service';
import { AuthService } from '../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-published-study-plans',
  templateUrl: './published-study-plans.component.html',
  styleUrls: ['./published-study-plans.component.scss']
})
export class PublishedStudyPlansComponent implements OnInit {
  type: String = 'published';
  currUsername: string;
  profileUsername: string;
  currIsChild: boolean;
  currIsAdmin: boolean;
  studyPlans: StudyPlan[];
  tempPlan: StudyPlan;
  numberOfElements: number;
  noPages: number;
  pageSize: number;
  pageIndex: number;

  // delete modal
  deleteIndex: number;

  constructor(private studyPlanService: StudyPlanService, private authService: AuthService, private router: Router,
    private activatedRoute: ActivatedRoute, private toastrService: ToastrService, private translate: TranslateService) { }

  ngOnInit() {
    this.authService.getUserData(['username', 'isChild', 'isAdmin']).subscribe(currUser => {
      this.currUsername = currUser.data.username;
      this.currIsChild = currUser.data.isChild;
      this.currIsAdmin = currUser.data.isAdmin;
      this.activatedRoute.params.subscribe((params) => {
        this.profileUsername = params.username;
      });
    });
    this.getStudyPlans(1);
  }

  getStudyPlans(index) {
    // to retreive the pages one by one the number has to be passed to the call each time incremented by one
    // event occurs at the loading of the pages each time so if there is an event indx is incremented by one
    // else its a one as we are at the start of loading the published plans
    let self = this;
    this.studyPlanService.getPublishedStudyPlans(index).subscribe(function (res) {
      self.updateLayout(res);
    });
  }

  updateLayout(res) {
    this.studyPlans = res.data.docs;
    this.numberOfElements = Number(res.data.total);
    this.noPages = Number(res.data.pages);
    this.pageSize = Number(res.data.limit);
    this.pageIndex = Number(res.data.page);
  }

  // calculate the number of pages to display in pagination
  getPaginationRange(): any {

    let pageNumbers = [];
    let counter = 1;

    if (this.pageIndex < 3) {
      // we are in page 1 or 2
      while (counter < 6 && counter <= this.noPages) {
        pageNumbers.push(counter);
        counter += 1;
      }
    } else {
      // we are in a page greater than 2
      pageNumbers.push(this.pageIndex - 2);
      pageNumbers.push(this.pageIndex - 1);
      pageNumbers.push(this.pageIndex);
      if (this.pageIndex + 1 <= this.noPages) {
        pageNumbers.push(this.pageIndex + 1);
      }
      if (this.pageIndex + 2 <= this.noPages) {
        pageNumbers.push(this.pageIndex + 2);
      }
    }
    return pageNumbers;
  }

  delete(index): void {
    let plan = this.studyPlans[index];
    this.studyPlanService
      .deletePublishedStudyPlan(plan._id)
      .subscribe(res => {
        if (res.err) {
          this.toastrService.error(res.err);
        } else if (res.msg) {
          this.studyPlans.splice(index, 1);
          this.toastrService.success(res.msg);
        }
      });

  }

  removePublishedStudyPlan(studyPlanId): void {
    let self = this;
    self.studyPlanService.removePublishedStudyPlans(studyPlanId).subscribe(function (res) {
    });
  }
}
