import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudyPlanComponent } from './study-plan/study-plan.component';
import { PublishedStudyPlansComponent } from './study-plan/published-study-plans/published-study-plans.component';
import { StudyPlanCreateComponent } from './study-plan/study-plan-create/study-plan-create.component';
const routes = [
  {
    path: 'schedule',
    component: ScheduleComponent
  },
  {
    path: 'schedule/:username',
    component: ScheduleComponent
  },
  {
    path: 'study-plan',
    children: [
      {
        path: 'published',
        component: PublishedStudyPlansComponent
      },
      {
        path: ':type/:id',
        component: StudyPlanComponent,
      },
      {
        path: ':type/:id/:username',
        component: StudyPlanComponent
      },
      {
        path: 'create',
        component: StudyPlanCreateComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class SchedulingRoutingModule { }
