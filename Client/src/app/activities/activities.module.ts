import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from './activity/activity.component';
import { ActivitiesRoutingModule } from './activities-routing.module';
@NgModule({
  imports: [
    ActivitiesRoutingModule
  ],
  declarations: [ActivityComponent]
})
export class ActivitiesModule { }
