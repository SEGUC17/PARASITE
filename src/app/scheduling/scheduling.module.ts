import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudyPlanComponent } from './study-plan/study-plan.component';
import { SchedulingRoutingModule } from './scheduling-routing.module';
import { CalendarModule } from 'angular-calendar';
import { StudyPlanService } from './study-plan/study-plan.service';
import { ScheduleService } from './schedule/schedule.service';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { FormsModule } from '@angular/forms';
import { QuillEditorModule } from 'ngx-quill-editor';
import { StudyPlanListViewComponent } from './study-plan/study-plan-list-view/study-plan-list-view.component';
import { PublishedStudyPlansComponent } from './study-plan/published-study-plans/published-study-plans.component';
import { StudyPlanEditViewComponent } from './study-plan/study-plan-edit-view/study-plan-edit-view.component';
import { SharedModule } from '../shared/shared.module';
import { AdminService } from '../admin/admin.service';


@NgModule({
  imports: [
    SchedulingRoutingModule,
    CommonModule,
    CalendarModule.forRoot(),
    FormsModule,
    QuillEditorModule,
    SharedModule
  ],
  declarations: [
    ScheduleComponent,
    StudyPlanComponent,
    CalendarHeaderComponent,
    StudyPlanListViewComponent,
    PublishedStudyPlansComponent,
    StudyPlanEditViewComponent
  ],
  exports: [
    ScheduleComponent,
    StudyPlanListViewComponent
  ],
  providers: [
    StudyPlanService,
    ScheduleService,
    AdminService
  ]
})
export class SchedulingModule { }
