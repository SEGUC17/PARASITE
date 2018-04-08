import { Component, OnInit, Input } from '@angular/core';
import { StudyPlan } from '../study-plan';
import { StudyPlanService } from '../study-plan.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-study-plan-list-view',
  templateUrl: './study-plan-list-view.component.html',
  styleUrls: ['./study-plan-list-view.component.css']
})
export class StudyPlanListViewComponent implements OnInit {
  @Input() type: String;
  @Input() username: String;
  @Input() currIsChild: Boolean;
  studyPlans: StudyPlan[];
  numberOfElements: Number;
  pageSize: Number;
  pageIndex: Number;

  constructor(private studyPlanService: StudyPlanService) { }

  ngOnInit() {
    this.getStudyPlans();
  }

  getStudyPlans(pageEvent?: PageEvent) {
    if (!this.username) {
      this.username = 'undefined';
    }
    if (this.type === 'published') {
      // to retreive the pages one by one the number has to be passed to the call each time incremented by one
      // event occurs at the loading of the pages each time so if there is an event indx is incremented by one
      // else its a one as we are at the start of loading the published plans
      this.studyPlanService.getPublishedStudyPlans(pageEvent ? pageEvent.pageIndex + 1 : 1).subscribe(
        res => this.updateLayout(res));
    } else {
      this.studyPlanService.getPersonalStudyPlans(this.username).subscribe(
        res => this.studyPlans = res.data);
    }
  }

  updateLayout(res) {
    this.studyPlans = res.data.docs;
    this.numberOfElements = res.data.total;
    this.pageSize = res.data.limit;
    this.pageIndex = res.data.pageIndex;
  }
}
