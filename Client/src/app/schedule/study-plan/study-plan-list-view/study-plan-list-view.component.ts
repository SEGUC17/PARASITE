import { Component, OnInit, Input } from '@angular/core';
import { StudyPlan } from '../study-plan';
import { StudyPlanService } from '../study-plan.service';



@Component({
  selector: 'app-study-plan-list-view',
  templateUrl: './study-plan-list-view.component.html',
  styleUrls: ['./study-plan-list-view.component.css']
})
export class StudyPlanListViewComponent implements OnInit {
  @Input() type: String;
  @Input() username: String;
  studyPlans: StudyPlan[];
  numberOfElements: Number;
  pageSize: Number;
  pageIndex: Number;

  constructor(private studyPlanService: StudyPlanService) { }

  ngOnInit() {
    this.getStudyPlans();
  }

  getStudyPlans() {
    if (this.type === 'published') {
      this.studyPlanService.getPublishedStudyPlans().subscribe(
        res => this.updateLayout(res));
    } else {
      this.studyPlanService.getPersonalStudyPlans(this.username).subscribe(
        res => this.updateLayout(res));
    }
  }

  updateLayout(res) {
    this.studyPlans = res.data.docs;
    this.numberOfElements = res.data.total;
    this.pageSize = res.data.limit;
    this.pageIndex = res.data.pageIndex;
  }
}
