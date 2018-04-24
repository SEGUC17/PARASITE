import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { ViewContentRequestsComponent } from '../content/view-content-requests/view-content-requests.component';
import { ContentViewComponent } from '../content/content-view/content-view.component';
import { ViewUnverifiedActivitiesComponent } from './view-unverified-activities/view-unverified-activities.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { ViewProductRequestsComponent } from './view-product-requests/view-product-requests.component';
import { ViewPsychRequestsComponent } from './view-psych-requests/view-psych-requests.component';
import { PublishRequestsComponent } from '../schedule/study-plan/publish-requests/publish-requests.component';
// import { ViewReportsComponent } from './view-reports/view-reports.component'

const routes = [
  { path: 'admin', component: AdminControlComponent },
  { path: 'admin/prod-req', component: ViewProductRequestsComponent },
  { path: 'admin/ContentRequests', component: ViewContentRequestsComponent },
  { path: 'admin/category', component: CategoryManagementComponent },
  { path: 'content-view/:id', component: ContentViewComponent },
  { path: 'admin/category', component: CategoryManagementComponent },
  { path: 'admin/UnverifiedActivities', component: ViewUnverifiedActivitiesComponent },
  { path: 'admin/PsychRequests', component: ViewPsychRequestsComponent },
  { path: 'admin/PubRequests', component: PublishRequestsComponent }
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

