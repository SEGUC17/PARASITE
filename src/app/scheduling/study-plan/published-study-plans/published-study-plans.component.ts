import { Component, OnInit } from '@angular/core';
import { StudyPlanService } from '../study-plan.service';

@Component({
  selector: 'app-published-study-plans',
  templateUrl: './published-study-plans.component.html',
  styleUrls: ['./published-study-plans.component.scss']
})
export class PublishedStudyPlansComponent implements OnInit {
  type: String = 'published';

  // declaring the type with published for the if condition is study-plan-list-view
  constructor(private studyPlanService: StudyPlanService) { }

  ngOnInit() {
  }

  removePublishedStudyPlan(studyPlanId): void {
    let self = this;
    self.studyPlanService.removePublishedStudyPlans(studyPlanId).subscribe(function (res) {
    });
  }
}
