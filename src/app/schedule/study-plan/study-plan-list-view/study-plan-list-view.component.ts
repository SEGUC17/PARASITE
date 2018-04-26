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
  currUsername: string;
  profileUsername: string;
  currIsChild: boolean;
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
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getStudyPlans();
  }

  getStudyPlans(pageEvent?: PageEvent) {
    this.authService.getUserData(['username', 'isChild']).subscribe(currUser => {
      this.currUsername = currUser.data.username;
      this.currIsChild = currUser.data.isChild;
      this.activatedRoute.params.subscribe((params) => {
        this.profileUsername = params.username;
      });
      if (this.type === 'published') {
        // to retreive the pages one by one the number has to be passed to the call each time incremented by one
        // event occurs at the loading of the pages each time so if there is an event indx is incremented by one
        // else its a one as we are at the start of loading the published plans
        this.studyPlanService.getPublishedStudyPlans(pageEvent ? pageEvent.pageIndex + 1 : 1).subscribe(res => this.updateLayout(res));
      } else if (this.type === 'personal') {
        if (!this.profileUsername || this.currUsername === this.profileUsername) {
          this.authService.getUserData(['studyPlans']).subscribe(res => this.studyPlans = res.data.studyPlans);
        } else {
          this.authService.getAnotherUserData(['studyPlans'], this.profileUsername).subscribe(res => this.studyPlans = res.data.studyPlans);
        }
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

  delete(index): void {
    let plan = this.studyPlans[index];
    if (this.type === 'published') {
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
    } else if (this.type === 'personal') {
      this.studyPlanService
        .deleteStudyPlan(plan._id)
        .subscribe(res => {
          if (res.err) {
            alert(res.err);
          } else if (res.msg) {
            this.studyPlans.splice(index, 1);
            alert(res.msg);
          }
        });
    }
    this.refreshDocument();
  }
}
