import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ViewProductRequestsComponent } from './view-product-requests/view-product-requests.component';
import { MatCardModule } from '@angular/material/card';
import { ProductRequestsService } from './view-product-requests/product-requests.service';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule
  ],
  declarations: [AdminControlComponent, ViewProductRequestsComponent],
  providers: [ProductRequestsService]
})
export class AdminModule { }
