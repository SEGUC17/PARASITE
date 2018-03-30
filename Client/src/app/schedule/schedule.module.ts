import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudyPlanComponent } from './study-plan/study-plan.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { StudyplanService } from './study-plan/studyplan.service';
import { ScheduleService } from './schedule/schedule.service';

@NgModule({
  imports: [
    ScheduleRoutingModule
  ],
  declarations: [ScheduleComponent, StudyPlanComponent],
  providers: [StudyplanService, ScheduleService]
})
export class ScheduleModule { }
