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
import { PublishedStudyPlansComponent } from './study-plan/published-study-plans/published-study-plans.component';
import { StudyPlanCreateComponent } from './study-plan/study-plan-create/study-plan-create.component';
import { SharedModule } from '../shared/shared.module';
import { AdminService } from '../admin/admin.service';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    SchedulingRoutingModule,
    CommonModule,
    CalendarModule.forRoot(),
    FormsModule,
    QuillEditorModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    ScheduleComponent,
    StudyPlanComponent,
    CalendarHeaderComponent,
    PublishedStudyPlansComponent,
    StudyPlanCreateComponent
  ],
  exports: [
    ScheduleComponent
  ],
  providers: [
    StudyPlanService,
    ScheduleService,
    AdminService
  ]
})
export class SchedulingModule { }
