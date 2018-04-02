import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AdminRoutingModule } from './admin-routing.module';
import { PsychRequestsService } from './view-psych-requests/psych-requests.service';
import { ViewProductRequestsComponent } from './view-product-requests/view-product-requests.component';
import { MatCardModule } from '@angular/material/card';
import { ProductRequestsService } from './view-product-requests/product-requests.service';
import { ViewContentRequestsComponent } from '../content/view-content-requests/view-content-requests.component';
import {
  ViewVerifiedContributerRequestsComponent
} from './view-verified-contributer-requests/view-verified-contributer-requests.component';
import { AdminService } from '../admin.service';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ViewPsychRequestsComponent } from './view-psych-requests/view-psych-requests.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatInputModule,
    MatChipsModule,
    MatSelectModule,
    FormsModule,
    MatCardModule,
    MatTabsModule
  ],
  declarations: [AdminControlComponent,
    ViewContentRequestsComponent,
    ViewVerifiedContributerRequestsComponent,
    CategoryManagementComponent,
    ViewProductRequestsComponent,
    ViewContentRequestsComponent,
    ViewPsychRequestsComponent],
  exports: [
    MatButtonModule,
    MatButtonToggleModule,
    ViewContentRequestsComponent

  ],
  providers: [
    AdminService, ProductRequestsService, PsychRequestsService
  ]
})
export class AdminModule { }
