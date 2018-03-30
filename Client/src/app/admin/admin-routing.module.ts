import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { ViewProductRequestsComponent } from './view-product-requests/view-product-requests.component';

const routes = [
  { path: 'admin', component: AdminControlComponent },
  { path: 'admin/prod-req', component: ViewProductRequestsComponent}
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
