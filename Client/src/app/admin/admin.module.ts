import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ViewRequestsComponent } from './view-requests/view-requests.component';
import { ViewResourcesIdeasRequestsComponent } from './view-resources-ideas-requests/view-resources-ideas-requests.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  declarations: [AdminControlComponent, ViewRequestsComponent, ViewResourcesIdeasRequestsComponent]
})
export class AdminModule { }
