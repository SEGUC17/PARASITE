import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ViewContentRequestsComponent } from './view-content-requests/view-content-requests.component';
import { ViewUnverifiedActivitiesComponent } from './view-unverified-activities/view-unverified-activities.component';
import {
  ViewVerifiedContributerRequestsComponent
} from './view-verified-contributer-requests/view-verified-contributer-requests.component';
import { AdminService } from '../admin.service';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import { MatCardModule, MatPaginatorModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatExpansionModule,
    MatListModule,
    MatCardModule,
    MatPaginatorModule
  ],
  declarations: [AdminControlComponent,
    ViewContentRequestsComponent,
    ViewVerifiedContributerRequestsComponent,
    ViewUnverifiedActivitiesComponent,
    CategoryManagementComponent],
  exports: [
    MatButtonModule,
    MatButtonToggleModule

  ],
  providers: [
    AdminService
  ]
})
export class AdminModule { }
