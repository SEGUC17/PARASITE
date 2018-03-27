import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudyPlanComponent } from './study-plan/study-plan.component';
const routes = [
  { path: 'schedule/:id', component: ScheduleComponent },
  { path: 'study-plan/:id', component: StudyPlanComponent }
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
