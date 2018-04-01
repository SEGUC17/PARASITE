import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { MarketRoutingModule } from './market-routing.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MarketService } from './market.service';
import { MatFormFieldModule, MatButtonModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
// import { CreateProductService } from './create-product/create-product.service';
@NgModule({
  imports: [
    CommonModule,
    MarketRoutingModule,
    MatCardModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    RouterModule
  ],
  providers: [MarketService,
    //  CreateProductService
    ],
  declarations: [MarketComponent, ProductDetailComponent, CreateProductComponent]
})
export class MarketModule { }
