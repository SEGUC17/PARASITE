import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';

import { ActivityComponent } from './activity/activity.component';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivityService } from './activity.service';
import { ActivityCreateComponent } from './activity-create/activity-create.component';

@NgModule({
  imports: [
    ActivitiesRoutingModule,
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [ActivityComponent, ActivityCreateComponent],
  providers: [ActivityService]
})
export class ActivitiesModule { }
