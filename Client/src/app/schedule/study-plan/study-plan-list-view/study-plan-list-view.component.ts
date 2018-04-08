import { Component, OnInit, Input } from '@angular/core';
import { StudyPlan } from '../study-plan';
import { StudyPlanService } from '../study-plan.service';
import { AuthService } from '../../../auth/auth.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-study-plan-list-view',
  templateUrl: './study-plan-list-view.component.html',
  styleUrls: ['./study-plan-list-view.component.css']
})
export class StudyPlanListViewComponent implements OnInit {
  @Input() type: string;
  @Input() username: string;
  @Input() currIsChild: boolean;
  studyPlans: StudyPlan[];
  numberOfElements: Number;
  pageSize: Number;
  pageIndex: Number;

  constructor(private studyPlanService: StudyPlanService, private authService: AuthService) { }

  ngOnInit() {
    this.getStudyPlans();
  }

  getStudyPlans(pageEvent?: PageEvent) {
    if (!this.username) {
      this.username = 'undefined';
    }
    if (this.type === 'published') {
      this.studyPlanService.getPublishedStudyPlans(pageEvent ? pageEvent.pageIndex + 1 : 1).subscribe(res => this.updateLayout(res));
    } else {
      this.authService.getAnotherUserData(['studyPlans'], this.username).subscribe(res => this.studyPlans = res.data.studyPlans);
    }
  }

  updateLayout(res) {
    this.studyPlans = res.data.docs;
    this.numberOfElements = res.data.total;
    this.pageSize = res.data.limit;
    this.pageIndex = res.data.pageIndex;
  }
}
