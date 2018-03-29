import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ViewResourcesIdeasRequestsComponent } from './view-resources-ideas-requests/view-resources-ideas-requests.component';
import { ViewVerifiedContributerRequestsComponent } from './view-verified-contributer-requests/view-verified-contributer-requests.component';
import {MatButtonModule} from '@angular/material/button';
import {AdminService} from "../admin.service";

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatButtonModule
  ],
  exports: [
    MatButtonModule

  ],
  providers: [
    AdminService
  ],
  declarations: [AdminControlComponent, ViewResourcesIdeasRequestsComponent, ViewVerifiedContributerRequestsComponent]
})
export class AdminModule { }
