import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';
import { MarketRoutingModule } from './market-routing.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatOptionModule, MatSelectModule, MatGridListModule, MatButtonModule } from '@angular/material';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MatCardModule } from '@angular/material';
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
    MatGridListModule,
    MatPaginatorModule,
    MatButtonModule,
    FormsModule
  ],
  providers: [MarketService],
  declarations: [MarketComponent, ProductDetailComponent]
})
export class MarketModule { }
