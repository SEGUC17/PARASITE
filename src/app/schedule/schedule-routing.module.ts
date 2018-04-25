import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudyPlanComponent } from './study-plan/study-plan.component';
import { PublishedStudyPlansComponent } from './study-plan/published-study-plans/published-study-plans.component';
import { StudyPlanEditViewComponent } from './study-plan/study-plan-edit-view/study-plan-edit-view.component';
const routes = [
  { path: 'schedule/:username', component: ScheduleComponent },
  { path: 'study-plan/:type/:id/:username', component: StudyPlanComponent },
  { path: 'study-plan/:type/:id', component: StudyPlanComponent },
  { path: 'published-study-plans', component: PublishedStudyPlansComponent },
  { path: 'study-plan-edit/:type/:id/:username', component: StudyPlanEditViewComponent },
  { path: 'study-plan-edit/:type/:id', component: StudyPlanEditViewComponent },
  {
    path: 'mySchedule',
    component: ScheduleComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ScheduleRoutingModule { }
