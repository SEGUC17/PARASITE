import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivityComponent } from './activity/activity.component';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivityService } from './activity.service';
import { AuthService } from '../auth/auth.service';
import { ActivityCreateComponent } from './activity-create/activity-create.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ActivityEditComponent } from './activity-edit/activity-edit.component';
import { DiscussionService } from '../discussion.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    ActivitiesRoutingModule,
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatListModule,
    MatDialogModule,
    MatTooltipModule,
    SharedModule
  ],
  declarations: [ActivityComponent, ActivityCreateComponent, ActivityDetailComponent, ActivityEditComponent],
  entryComponents: [ActivityEditComponent],
  providers: [ActivityService, DiscussionService , { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }]
})
export class ActivitiesModule { }
