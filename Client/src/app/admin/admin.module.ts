import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ViewResourcesIdeasRequestsComponent } from './view-resources-ideas-requests/view-resources-ideas-requests.component';
import {
  ViewVerifiedContributerRequestsComponent
} from './view-verified-contributer-requests/view-verified-contributer-requests.component';
import { AdminService } from '../admin.service';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  exports: [
    MatButtonModule

  ],
  providers: [
    AdminService
  ],
  declarations: [AdminControlComponent,
    ViewResourcesIdeasRequestsComponent,
    ViewVerifiedContributerRequestsComponent,
    CategoryManagementComponent]
})
export class AdminModule { }
