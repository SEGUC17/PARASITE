import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ActivityComponent } from './activity/activity.component';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivityService } from './activity.service';

@NgModule({
  imports: [
    ActivitiesRoutingModule,
    CommonModule,
    MatCardModule,
    MatPaginatorModule
  ],
  declarations: [ActivityComponent],
  providers: [ActivityService]
})
export class ActivitiesModule { }
