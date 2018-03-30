import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { MarketRoutingModule } from './market-routing.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MatCardModule } from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MarketService } from './market.service';
@NgModule({
  imports: [
    CommonModule,
    MarketRoutingModule,
    MatCardModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule
  ],
  providers: [MarketService],
  declarations: [MarketComponent, CreateProductComponent, ProductDetailComponent]
})
export class MarketModule { }
