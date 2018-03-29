import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudyPlanComponent } from './study-plan/study-plan.component';
import { ScheduleRoutingModule } from './schedule-routing.module';

@NgModule({
  imports: [
    ScheduleRoutingModule
  ],
  declarations: [ScheduleComponent, StudyPlanComponent]
})
export class ScheduleModule { }
