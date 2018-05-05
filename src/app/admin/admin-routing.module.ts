import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { ViewContentRequestsComponent } from './view-content-requests/view-content-requests.component';
import { ContentViewComponent } from '../content/content-view/content-view.component';
import { ViewUnverifiedActivitiesComponent } from './view-unverified-activities/view-unverified-activities.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { ViewProductRequestsComponent } from './view-product-requests/view-product-requests.component';
import { ViewPsychRequestsComponent } from './view-psych-requests/view-psych-requests.component';
import { PublishRequestsComponent } from './publish-requests/publish-requests.component';
// tslint:disable-next-line:import-spacing
import { ViewVerifiedContributerRequestsComponent } from
  './view-verified-contributer-requests/view-verified-contributer-requests.component';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { AdminGuardService } from '../admin-guard.service';

const routes = [
  {
    path: '',
    component: AdminControlComponent,
    canActivate: [AdminGuardService],
    children: [
      {
        path: 'product-req',
        component: ViewProductRequestsComponent
      },
      {
        path: 'content-req',
        component: ViewContentRequestsComponent
      },
      {
        path: 'category',
        component: CategoryManagementComponent
      },
      {
        path: 'unverified-activites',
        component: ViewUnverifiedActivitiesComponent
      },
      {
        path: 'psych-req',
        component: ViewPsychRequestsComponent
      },
      {
        path: 'publish-req',
        component: PublishRequestsComponent
      },
      {
        path: 'verified-contributor-req',
        component: ViewVerifiedContributerRequestsComponent
      },
      {
        path: 'reports',
        component: ViewReportsComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }

