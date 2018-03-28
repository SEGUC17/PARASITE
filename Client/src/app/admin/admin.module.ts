import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ViewRequestsComponent } from './view-requests/view-requests.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
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
  declarations: [AdminControlComponent, ViewRequestsComponent, CategoryManagementComponent]
})
export class AdminModule { }
