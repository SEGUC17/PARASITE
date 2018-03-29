import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { ViewResourcesIdeasRequestsComponent } from './view-resources-ideas-requests/view-resources-ideas-requests.component';


import { CategoryManagementComponent } from './category-management/category-management.component';
const routes = [
  { path: 'admin', component: AdminControlComponent },
  { path: 'admin/res', component: ViewResourcesIdeasRequestsComponent },
  { path: 'admin/category', component: CategoryManagementComponent }
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
