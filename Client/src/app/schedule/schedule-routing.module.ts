import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudyPlanComponent } from './study-plan/study-plan.component';
import { PublishedStudyPlansComponent } from './study-plan/published-study-plans/published-study-plans.component';
const routes = [
  { path: 'schedule/:id', component: ScheduleComponent },
  { path: 'study-plan/:type/:id', component: StudyPlanComponent },
  { path: 'published-study-plans', component: PublishedStudyPlansComponent }
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
