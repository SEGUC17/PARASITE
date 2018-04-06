import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudyPlanComponent } from './study-plan/study-plan.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { CalendarModule } from 'angular-calendar';
import { StudyPlanService } from './study-plan/study-plan.service';
import { ScheduleService } from './schedule/schedule.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { QuillEditorModule } from 'ngx-quill-editor';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import {
  NgbDatepickerModule,
  NgbTimepickerModule
} from '@ng-bootstrap/ng-bootstrap';
import { StudyPlanListViewComponent } from './study-plan/study-plan-list-view/study-plan-list-view.component';
import { PublishedStudyPlansComponent } from './study-plan/published-study-plans/published-study-plans.component';
import { StudyPlanEditViewComponent } from './study-plan/study-plan-edit-view/study-plan-edit-view.component';
import { StarRatingComponent } from './study-plan/star-rating/star-rating.component';



@NgModule({
  imports: [
    ScheduleRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    FormsModule,
    NgbModule,
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
    QuillEditorModule,
    MatDividerModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatSnackBarModule,
    AmazingTimePickerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [
    ScheduleComponent,
    StudyPlanComponent,
    CalendarHeaderComponent,
    DateTimePickerComponent,
    StudyPlanListViewComponent,
    PublishedStudyPlansComponent,
    StudyPlanEditViewComponent,
    StarRatingComponent
  ],
  exports: [
    ScheduleComponent,
    StudyPlanListViewComponent
  ],
  providers: [StudyPlanService, ScheduleService]
})
export class ScheduleModule { }
