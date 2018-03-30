import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudyPlanComponent } from './study-plan/study-plan.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { CalendarModule } from 'angular-calendar';

@NgModule({
  imports: [
    ScheduleRoutingModule,CommonModule,
    CalendarModule.forRoot()
  ],
  declarations: [ScheduleComponent, StudyPlanComponent]
})
export class ScheduleModule { }
