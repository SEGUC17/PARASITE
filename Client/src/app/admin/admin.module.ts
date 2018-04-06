import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AdminRoutingModule } from './admin-routing.module';
import { PsychRequestsService } from './view-psych-requests/psych-requests.service';
import { ViewProductRequestsComponent } from './view-product-requests/view-product-requests.component';
import { ProductRequestsService } from './view-product-requests/product-requests.service';
import { ViewContentRequestsComponent } from '../content/view-content-requests/view-content-requests.component';
import { ViewUnverifiedActivitiesComponent } from './view-unverified-activities/view-unverified-activities.component';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule, MatPaginatorModule } from '@angular/material';
import { ViewPsychRequestsComponent } from './view-psych-requests/view-psych-requests.component';
import { AuthService } from '../auth/auth.service';

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
    MatTabsModule,
    MatListModule,
    MatRadioModule,
    MatCardModule,
    MatTabsModule,
    MatRadioModule,
    MatPaginatorModule,
    MatExpansionModule
  ],
  declarations: [
    AdminControlComponent,
    ViewContentRequestsComponent,
    ViewVerifiedContributerRequestsComponent,
    CategoryManagementComponent,
    ViewUnverifiedActivitiesComponent,
    ViewProductRequestsComponent,
    ViewContentRequestsComponent,
    ViewPsychRequestsComponent],
  exports: [
    MatButtonModule,
    MatButtonToggleModule,
    ViewContentRequestsComponent
  ],
  providers: [
    AdminService, ProductRequestsService, PsychRequestsService, AuthService
  ]
})
export class AdminModule { }
