import { Component, OnInit, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { StudyPlan } from '../study-plan';
import { StudyPlanService } from '../study-plan.service';
import { AuthService } from '../../../auth/auth.service';
import { Subject } from 'rxjs/Subject';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-study-plan-list-view',
  templateUrl: './study-plan-list-view.component.html',
  styleUrls: ['./study-plan-list-view.component.scss']
})
export class StudyPlanListViewComponent implements OnInit {
  @Input() type: string;
  currUsername: string;
  profileUsername: string;
  currIsChild: boolean;
  studyPlans: StudyPlan[];
  tempPlan: StudyPlan;
  numberOfElements: number;
  noPages: number;
  pageSize: number;
  pageIndex: number;
  color: string;

  // Utility
  refresh: Subject<any> = new Subject();

  constructor(
    private studyPlanService: StudyPlanService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.authService.getUserData(['username', 'isChild']).subscribe(currUser => {
      this.currUsername = currUser.data.username;
      this.currIsChild = currUser.data.isChild;
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

  refreshDocument() {
    // Light refresh to show any changes
    const self = this;
    setTimeout(function () {
      return self.refresh.next();
    }, 0);
  }

  delete(index): void {
    let plan = this.studyPlans[index];
    this.studyPlanService
      .deletePublishedStudyPlan(plan._id)
      .subscribe(res => {
        if (res.err) {
          alert(res.err);
        } else if (res.msg) {
          this.studyPlans.splice(index, 1);
          alert(res.msg);
        }
      });

  }
}
