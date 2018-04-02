import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { ActivityCreateComponent } from './activity-create/activity-create.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';

const routes = [
  { path: 'activities', component: ActivityComponent },
  { path: 'activities/:id', component: ActivityDetailComponent},
  { path: 'create-activity', component: ActivityCreateComponent }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ActivitiesRoutingModule { }
