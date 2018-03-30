import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from './activity/activity.component';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivityService } from './activity.service';
@NgModule({
  imports: [
    ActivitiesRoutingModule
  ],
  declarations: [ActivityComponent],
  providers: [ActivityService]
})
export class ActivitiesModule { }
