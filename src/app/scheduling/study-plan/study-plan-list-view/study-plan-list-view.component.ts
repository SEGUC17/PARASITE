import { Component, OnInit, Input } from '@angular/core';
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
  @Input() username: string;
  @Input() currIsChild: boolean;
  studyPlans: StudyPlan[];
  tempPlan: StudyPlan;
  numberOfElements: Number;
  pageSize: Number;
  pageIndex: Number;
  color: string;
  availableColors = [
    { name: 'assigned', color: '' }
  ];

  // Utility
  refresh: Subject<any> = new Subject();

  constructor(
    private studyPlanService: StudyPlanService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getStudyPlans();
  }

  getStudyPlans(pageEvent?: PageEvent) {
    if (!this.username) {
      this.username = 'undefined';
    }
    this.authService.getUserData(['username', 'isChild']).subscribe(currUser => {
      this.username = currUser.data.username;
      this.currIsChild = currUser.data.isChild;
      if (this.type === 'published') {
        // to retreive the pages one by one the number has to be passed to the call each time incremented by one
        // event occurs at the loading of the pages each time so if there is an event indx is incremented by one
        // else its a one as we are at the start of loading the published plans
        this.studyPlanService.getPublishedStudyPlans(pageEvent ? pageEvent.pageIndex + 1 : 1).subscribe(res => this.updateLayout(res));
      } else {
        this.authService.getAnotherUserData(['studyPlans'], this.username).subscribe(res => this.studyPlans = res.data.studyPlans);
      }
    });
  }

  updateLayout(res) {
    this.studyPlans = res.data.docs;
    this.numberOfElements = res.data.total;
    this.pageSize = res.data.limit;
    this.pageIndex = res.data.pageIndex;
  }

  refreshDocument() {
    // Light refresh to show any changes
    const self = this;
    setTimeout(function () {
      return self.refresh.next();
    }, 0);
  }

  delete(plan): void {
    if (plan.published) {
      this.studyPlanService
        .deletePublishedStudyPlan(plan._id)
        .subscribe(res => {
          if (res.msg === 'Study plan deleted successfully') {
            alert(res.msg);
          } else {
            alert(
              'An error occured while deleting the study plan, please try again.'
            );
          }
        });
    } else {
      this.studyPlanService
        .deleteStudyPlan(plan._id)
        .subscribe(res => {
          if (res.msg === 'Study plan deleted successfully') {
            alert(res.msg);
          } else {
            alert(
              'An error occured while deleting the study plan, please try again.'
            );
          }
        });
    }
    this.refreshDocument();
  }
}