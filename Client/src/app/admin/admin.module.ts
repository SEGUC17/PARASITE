import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ViewContentRequestsComponent } from './view-content-requests/view-content-requests.component';
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
import { MatTabsModule } from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatTabsModule,
    MatListModule,
    MatRadioModule,
    MatCardModule
  ],
  declarations: [
    AdminControlComponent,
    ViewContentRequestsComponent,
    ViewVerifiedContributerRequestsComponent,
    CategoryManagementComponent
  ],
  exports: [
    MatButtonModule,
    MatButtonToggleModule
  ],
  providers: [
    AdminService
  ]
})
export class AdminModule { }
