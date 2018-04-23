import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AdminRoutingModule } from './admin-routing.module';
import { PsychRequestsService } from './view-psych-requests/psych-requests.service';
import { ViewProductRequestsComponent } from './view-product-requests/view-product-requests.component';
import { ProductRequestsService } from './view-product-requests/product-requests.service';
import { ViewContentRequestsComponent } from '../content/view-content-requests/view-content-requests.component';
import { ViewUnverifiedActivitiesComponent } from './view-unverified-activities/view-unverified-activities.component';
import { PublishRequestsComponent } from '../schedule/study-plan/publish-requests/publish-requests.component';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewPsychRequestsComponent } from './view-psych-requests/view-psych-requests.component';
import { AuthService } from '../auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { CategoryCreateComponent } from './category-management/category-create/category-create.component';
import { CategoryUpdateComponent } from './category-management/category-update/category-update.component';
import { CategoryDeleteComponent } from './category-management/category-delete/category-delete.component';
import { SectionCreateComponent } from './category-management/section-create/section-create.component';
import { SectionUpdateComponent } from './category-management/section-update/section-update.component';

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
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    SharedModule
  ],
  declarations: [
    AdminControlComponent,
    ViewContentRequestsComponent,
    ViewVerifiedContributerRequestsComponent,
    CategoryManagementComponent,
    ViewUnverifiedActivitiesComponent,
    ViewProductRequestsComponent,
    ViewContentRequestsComponent,
    ViewPsychRequestsComponent,
    PublishRequestsComponent,
    CategoryCreateComponent,
    CategoryUpdateComponent,
    CategoryDeleteComponent,
    SectionCreateComponent,
    SectionUpdateComponent],
  exports: [
    MatButtonModule,
    MatButtonToggleModule,
    ViewContentRequestsComponent,
    PublishRequestsComponent
  ],
  providers: [
    AdminService, ProductRequestsService, PsychRequestsService, AuthService
  ]
})
export class AdminModule { }
