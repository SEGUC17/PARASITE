import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { ViewContentRequestsComponent } from './view-content-requests/view-content-requests.component';
import { ViewUnverifiedActivitiesComponent } from './view-unverified-activities/view-unverified-activities.component';

import { CategoryManagementComponent } from './category-management/category-management.component';
const routes = [
  { path: 'admin', component: AdminControlComponent },
  { path: 'admin/ContentRequests', component: ViewContentRequestsComponent },
  { path: 'admin/category', component: CategoryManagementComponent },
  { path: 'admin/UnverifiedActivities', component: ViewUnverifiedActivitiesComponent}
];
@NgModule({
  imports: [

    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
